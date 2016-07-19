/**
* TODO write template loader saprate
*
**/
module.exports = email;
var fs = require('fs');
var Handlebars = require('handlebars');

function email(data, opts) { opts = opts || {};
	this.opts = opts;
	this.data = data;


	this.from = opts.from || opts.sender;
	this.email = this.to = opts.receiver || opts.email;
	this.data.receiver = this.to;
	this.data.preHeader = opts.preHeader;
	
	this.text = opts.text || opts.text;
	this.subject = opts.subject || opts.subject;


	this.compiled = opts.compiled;
	if(!this.compiled){ this.setTemplate(opts) }
}

email.prototype.setTemplate = function(opts) {
	if(opts.template){
		this.template = opts.template;
		this.compiled = Handlebars.compile(this.template);
	}
	else if(opts.templateUrl) this.setTemplateByUrl(opts.templateUrl);

};

email.prototype.setTemplateByUrl = function(tmpUrl) {

	var _self = this;
	var path = null;

	if(Object.prototype.toString.call(tmpUrl) == '[object String]') path = tmpUrl;
	if(Object.prototype.toString.call(tmpUrl) == '[object Object]') path = tmpUrl.path || tmpUrl.url;
	if(path){
		try{
			_self.template = fs.readFileSync(path).toString();
			_self.compiled = Handlebars.compile(_self.template);
		}catch(e){ console.log(e.toString()); }
	}else console.log('Path is undefined');
	
};

email.prototype.toHTML = email.prototype.toHtml = function() { if(!this.compiled) return ''; return this.compiled(this.data) };
email.prototype.toOptions = function() {
	var _s = this;
	return {
		to:_s.email || _s.to
		, from:_s.from
		, text:_s.text
		, subject:_s.subject
		, html:_s.toHTML()
	}
};