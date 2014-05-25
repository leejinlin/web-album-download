// ==UserScript==
// @name        web-album
// @namespace   http://photo.weibo.com/*
// @include     http://photo.weibo.com/*
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.js
// ==/UserScript==
setTimeout(function(){
	function explode(inputstring, separators, includeEmpties) {
		inputstring = new String(inputstring);
		separators = new String(separators);

		if(separators == "undefined") {
			separators = " :;";
		}

		fixedExplode = new Array(1);
		currentElement = "";
		count = 0;

		for(x=0; x < inputstring.length; x++) {
			char = inputstring.charAt(x);
			if(separators.indexOf(char) != -1) {
				if ( ( (includeEmpties <= 0) || (includeEmpties == false)) && (currentElement == "")) { }
				else {
					fixedExplode[count] = currentElement;
					count++;
					currentElement = ""; 
				} }
			else { 
				currentElement += char; 
			}
		}

		if (( ! (includeEmpties <= 0) && (includeEmpties != false)) || (currentElement != "")) {
			fixedExplode[count] = currentElement;
		}
		return fixedExplode;
	}
	function get_imgs(album_id, pages, html) {
		var link = window.location.href;
		var paramas = explode(link,'/');
		var uid = paramas[3];
		var count=30;
		var album_type = 3;
		var base_url = 'http://photo.weibo.com/photos/get_all?';
		var img_base_url = 'http://ww3.sinaimg.cn/mw690/';
		var imgs = new Array();
		for (var i = 1; i <= pages; i++) {
			url = base_url+'uid='+uid+'&album_id='+album_id+'&count=30&page='+i+'&type='+album_type;
			$.ajax({
				url: url,
				type: 'GET',
				async: false,
			})
			.success(function(data) {
				$.each(data.data.photo_list, function(index, val) {
					if (val == null) {
						return;
					}
        			var img_url = img_base_url+val.pic_name;
        			html = html+img_url+"<br/>";
				});
			});
		}
		return html;
	}
	$('.M_txta').append('<a class="download_imgs">下载相册图片</a>').live('click', function(event) {
		var album_id;
		var lists = $('.albumlists li');
		var name = $('.namebox .name').text();
		var html = '<TITLE>'+name+'</TITLE>';
		$.each(lists, function(index, list) {
			num = parseInt(explode($(list).find('.count').text(),' '));
			if (num != 0) {
				count = 30;
				var pages = Math.ceil(num/count);
				items = explode($(list).attr('action-data'),'&');
				var album_id = items[0].substring(4);
				html = html + get_imgs(album_id, pages, html);
			}
		});
		var w = window.open("javascript:'" + html + "'");
	});
},1000);