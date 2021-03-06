const mongoose = require('mongoose');
var moment = require('moment');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// 虚拟属性'name'：表示作者全名
AuthorSchema.virtual('name').get(function() {
  var fullname = '';

  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name;
  }

  if (!this.first_name && !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// 虚拟属性'url'：作者 URL
AuthorSchema.virtual('url').get(function() {
  return '/catalog/author/' + this._id;
});

// 虚拟属性'lifespan'：作者寿命
/*.virtual('lifespan')
.get(function () {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});*/

AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = moment(this.date_of_birth).format('MMMM Do, YYYY');
  }
  lifetime_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += moment(this.date_of_death).format('MMMM Do, YYYY');
  }
  return lifetime_string;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function() {
  return moment(this.date_of_death).format('YYYY-MM-DD');
});  

// 导出 Author 模型
module.exports = mongoose.model('Author', AuthorSchema);