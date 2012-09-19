
  basis.require('app.ext.view');
  //basis.require('app.views.templateView.templatePanel');

  var TemplatePanel = resource('templatePanel.js')();

  var classList = basis.cssom.classList;
  var Template = basis.html.Template;

  function hasTemplate(node){
    return node.data.obj && node.data.obj.prototype && node.data.obj.prototype.template instanceof Template;
  }

  //
  // exports
  //
  module.exports = new app.ext.view.View({
    title: 'Template',
    viewHeader: 'Template',
    isAcceptableObject: function(data){
      return hasTemplate({ data: data });
    },

    template: resource('template/templateView.tmpl'),

    binding: {
      template: 'satellite:'
    },

    satelliteConfig: {
      viewOptions: {
        instanceOf: app.ext.view.ViewOptions,
        config: function(owner){
          var contentClassList = classList(owner.tmpl.content, 'show');

          return {
            title: 'References',
            childNodes: [
              {
                title: 'Schematic',
                handler: function(){
                  contentClassList.set('references');
                }
              },
              {
                title: 'Highlight',
                selected: true,
                handler: function(){
                  contentClassList.set('realReferences');
                }
              },
              {
                title: 'Hide',
                handler: function(){
                  contentClassList.clear();
                }
              }
            ]
          }
        }
      },
      template: {
        existsIf: hasTemplate,
        delegate: Function.$self,
        instanceOf: TemplatePanel
      }
    }
  });
