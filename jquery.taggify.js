// tagCloud v 0.09 super duper beta for jQuery 1.3
// c) 2010 Alex Welch - www.alexwelch.com - me@alexwelch.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 

(function($) {
	
	String.prototype.friendlyName = function() {
		return this.toLowerCase().replace(/ /g,'-').replace(/\./g, '_');
	}
	
	function uniqueArray(x) {
		tmp = new Array(0);   
	  for(i=0;i<x.length;i++) {    
		  if($.inArray(x[i], tmp) == -1) {
	      tmp.length+=1;         
	      tmp[tmp.length-1]=x[i];
	    }
	  }
	  return tmp;
	};
	
	function getTagClass(z, s, m, l, xl) {
		var tagClass = "smallest_tag";   
	  if(z==s) {   
	    tagClass="smallest_tag";   
	  } else if(z==xl) {   
	    tagClass="largest_tag";    
	  } else if(z >= l) {    
	    tagClass="large_tag";    
	  } else if(z <= l && z >= m) {    
	    tagClass="medium_tag";    
	  } else if(z <= m && z >= s) {    
	    tagClass="small_tag";
	  }
	  return tagClass;
	};
	
	function getTagsArray(tags_container) {				
		return $.map($(tags_container), function(a) { return $(a).text() })
	};
	
	$.fn.taggify = function(options) {
		settings = $.extend({
			item_container_selector: '#taggable_items .taggable_item',
			hidden_item_container_selector: '#taggable_items .hidden_taggable_item',
			tags_container_selector: '#taggable_items .taggable_item .tags ul li',
			hidden_item_class: 'hidden_taggable_item',
			current_class: 'current',
			fadeout_speed: 'normal',
			fadein_speed: 'slow',
			show_all_tags: true
		}, options);
		$(settings.tags_container_selector).addTagClasses(settings).makeTagLinks(settings);
		return $(this).makeTagCloud(settings);
	};
	
	// scrape all tags in $(this) and add them to their parent element as class names for searching
	$.fn.addTagClasses = function(options) {
		settings = $.extend({
			item_container_selector: '.taggable_item'		
		}, options);
		return $(this).each(function(index) {
			$(this).closest(settings.item_container_selector).addClass($(this).text().friendlyName());
		});
	};
	
	// scrapes all the tags in tags_container_selector and creates a tag cloud out of them
	$.fn.makeTagCloud = function(options) {
		settings = $.extend({
			tags_container_selector: '#taggable_items .taggable_item .tags ul li',
			show_all_tag: true,
			item_container_selector: '#taggable_items .taggable_item',
			hidden_item_class: 'hidden_taggable_item',
			hidden_item_container_selector: '#taggable_items .hidden_taggable_item',			
			current_class: 'current',
			fadeout_speed: 'normal',
			fadein_speed: 'slow'
		}, options);
		
		$container = $(this);
				
		$tags_container = $(settings.tags_container_selector);						
		
		var all_tags = getTagsArray($tags_container);		

		var unique_tags = uniqueArray(all_tags);
		unique_tags.sort(); //sort alphabetically			
		
		var frequency = new Array();
		var counts = new Array();
		var largest = 0;
		var smallest = 1;
		/* create array of tag counts and find sizes */		
		for(var i=0; i<unique_tags.length; i++) {
		   var mullet=0;
		   unique_tags[i] = unique_tags[i].replace(/^\s+|\s+$/g, '') ;
		   for(var j=0; j<all_tags.length; j++) {
		      if (unique_tags[i]==all_tags[j]) {
		          mullet=mullet+1;
		      }
		      frequency[i] = mullet;
		   }
		}
	
		for(var d=0;d<frequency.length;d++){
		   largest=Math.max(largest,frequency[d]); //find largest
		}
		var diff = largest-smallest; //difference, smallest is always 1
		var dist = diff/3; //distribution
		var large = 1 + (dist*2);
		var medium = 1 + dist;
			
		var all_tags_list = '';
		if(settings.show_all_tag) {
				all_tags_list += "<a title='all items' class='" + getTagClass(100, 1, 2, 3, 4) + "' href='#all'>All</a> ";
		}
		if(unique_tags.length != 0) {	  
		  for(var i=0; i<unique_tags.length; i++) {
		     var z=0;
		     for(var j=0; j<all_tags.length; j++) {
		        if (unique_tags[i]==all_tags[j]) {
		            z=z+1;
		        }
		        counts[i] = z;
		     }				 
				 var title_text = z + ((z==1) ? ' item' : ' items');
		     var size = getTagClass(z, smallest, medium, large, largest);
		     all_tags_list += "<a title='" + title_text + "' class='" + size + "' href='#" + unique_tags[i].friendlyName() + "'>" + unique_tags[i] + "</a> ";
		  }
		$container.html(all_tags_list);
		$container.find('a').makeTagLinks(settings);
		}
		return this;
	}
	
	// makes tags clickable, when clicked they show only items with that tag
	$.fn.makeTagLinks = function(options) {
		settings = $.extend({
			item_container_selector: '#taggable_items .taggable_item',
			hidden_item_class: 'hidden_taggable_item',
			hidden_item_container_selector: '#taggable_items .hidden_taggable_item',			
			current_class: 'current',
			fadeout_speed: 'normal',
			fadein_speed: 'slow'
		}, options);
		
		var $container = $(this);
		settings.container_selector = $container.selector;
		var $item_container = $(settings.item_container_selector);
		
		
		$container.click(function() {  
			$("html,body").animate({scrollTop: 0}, 200);
	    $(settings.container_selector).removeClass(settings.current_class);  
	    $(this).addClass(settings.current_class);

	    var filterVal = $(this).text().friendlyName();  

	    if(filterVal == 'all') {  
	    	$(settings.hidden_item_container_selector).fadeIn(settings.fadeout_speed).removeClass(settings.hidden_item_class);  
	    } else {  
	    	$item_container.each(function() {  
	    		if(!$(this).hasClass(filterVal)) {  
	        	$(this).fadeOut(settings.fadeout_speed).addClass(settings.hidden_item_class);  
	        } else {  
	        	$(this).fadeIn(settings.fadein_speed).removeClass(settings.hidden_item_class);  
	        }  
	      });  
	    }
	   	return false;
		});
		return $container;
	};
}(jQuery));