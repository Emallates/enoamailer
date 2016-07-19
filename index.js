module.exports = enoaMailer;
var Email = require('./lib/email');
var nodemailer = require('nodemailer');

function enoaMailer(options) {
	if (!(this instanceof enoaMailer)) { return new enoaMailer(options); }
	this.opts = options;
	this.templates = {};
	this.transporter = nodemailer.createTransport(options.mailer);
}

enoaMailer.prototype.sendEmail = function(email, data, opts, callback) { 
	if(typeof opts == 'function'){ callback = opts; opts = {}; }
	opts = opts || {};
	opts.email = email;
	opts.uuid = opts.uuid || opts.id || opts.templateUrl ;
	if(this.templates[ opts.uuid ]) opts.compiled = this.templates[opts.uuid];
	var _email = new Email(data, opts);
	if(opts.cache){
		if(opts.uuid) this.templates[opts.uuid] = _email.compiled;
	}
	this.transporter.sendMail(_email.toOptions(), callback)
	
};


enoaMailer.prototype.loadTemplates = function(opts) {
	// TODO load compiled templates
};