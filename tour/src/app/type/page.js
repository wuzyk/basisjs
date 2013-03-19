
basis.require('basis.entity');


var calc = basis.entity.CalculateField;

//
// main part
//

var Page = new basis.entity.EntityType({
  name: 'Page',
  fields: {
    filename: basis.entity.StringId,
    num: Number,
    hash: calc('filename', function(filename){
      return filename.replace(/\.[a-z]+$/, '');
    }),
    html: String,
    title: calc('filename', 'html', function(filename, html){
      var m = html.match(/<h1>((?:[\r\n]|.)*)<\/h1>/);
      return m ? m[1] : filename;
    }),
    code: calc('html', function(html){
      var m = html.match(/<pre id="sourceCode">((?:[\r\n]|.)*?)<\/pre>/);
      return m ? m[1] : '';
    }),
    description: calc('html', function(html){
      var m = html.match(/<div id="description">((?:[\r\n]|.)*?)<\/div>/);
      return m ? m[1] : '';
    }),
    files: calc('html', function(){
      return [
        new basis.data.Object({
          data: {
            filename: 'file1'
          }
        })
      ]
    })
  }
});
Page.addField('prev', Page);
Page.addField('next', Page);

Page.entityType.entityClass.extend({
  state: basis.data.STATE.UNDEFINED,
  syncAction: function(){
    var content = basis.resource('page/' + this.data.filename).fetch();
    this.set('html', content);
  }
});

Page.all.setSyncAction(function(){
  var data = basis.resource('page/index.json').fetch();
  
  this.sync(data);
  
  var prev = null;
  var next = null;
  for (var i = 0, page; page = Page.get(data[i]); i++)
  {
    next = Page.get(data[i + 1]);
    page.update({
      num: i + 1,
      prev: prev,
      next: next
    });
    prev = page;
  }
});


//
// export names
//

module.exports = Page;
