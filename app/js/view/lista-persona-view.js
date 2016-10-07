/**
 * Clase que implementa el listado de personas.
 * @class
 */
var ListaPersonaView = Backbone.View.extend({
    /**
     * Url del template que corresponde al view
     * @field
     */
    templateURL: "app/templates/lista-persona-tmpl.html",

    events: {
        "click #limpiar": "render",
        "click #filtrar": "filtrar2",
        "click #tr1": "clicked",
        "click #eliminar": "eliminar",
        "click #editar": "editar",
        "click #siguiente": "siguiente",
        "click #anterior": "anterior"
    },

    clicked: function(e){
        e.preventDefault();
        var id = $(e.currentTarget).data("id");
        this.selectedPersona = this.collection.get(id);
        thisParent = $(e.target).parent();
        thisParent.siblings('.active').removeClass('active');
        thisParent.addClass('active');
        $("#editar").removeAttr("disabled");
        $("#eliminar").removeAttr("disabled");

    },

    /**
     * @Constructor
     */
    initialize: function () {
        var thiz = this;
        this.selectedPersona=undefined;
        this.pagina=1;
        this.filtro="";
        this.pagMax=1;
        //cuando el collection cambia, se carga la lista.
        this.loadTemplate(function () {
            //una vez descargado el template se invoca al fetch para obtener los datos
            //del collection
            thiz.collection.fetch({ data: $.param({inicio: 0, cantidad: 10, filtro: this.filtro}),
                success : function(collection, response) {
                    thiz.pagMax=Math.ceil(response.total/10);
                    thiz.render();
                    $("#editar").attr("disabled", true);
                    $("#eliminar").attr("disabled", true);
                }
                });
        });
        this.listenTo(this.collection, 'destroy', this.render);
    },

    /**
     * Se encarga de renderizar el html de la página.
     * @function
     */
    render: function () {

        var tmpl = _.template(this.template);
        //se procesa el collection a un json
        var coll = this.collection.toJSON();
        //se añade el html resultante al contenedor del view.
        this.$el.html(tmpl({
            collection: coll,
            pagina: this.pagina,
            pagMax: this.pagMax
        }));
        return this;
    },

    /**
     * Para filtrar los datos de las personas.
     */
    filtrar2: function () {
        //Para renderizar los resultados de la busqueda
        var thiz=this;
        this.filtro=$(this.el).find('#filtrado').val();
        thiz.collection.fetch({ data: $.param({inicio: (this.pagina-1)*10, cantidad: 10, filtro: this.filtro}),
            success : function(collection, response) {
                thiz.pagMax=Math.ceil(response.total/10);
                thiz.render();
                $("#editar").attr("disabled", true);
                $("#eliminar").attr("disabled", true);
            }
        });
    },

    eliminar: function () {
        if(this.selectedPersona==undefined){
            alert("Seleccione un elemento primero!");
        }else {
            var a_eliminar = this.selectedPersona;
            var thiz = this;
            a_eliminar.destroy({
                dataType: 'text',
                success: function (model, response, options) {
                    alert("Se eliminó correctamente!");
                    thiz.collection.fetch();
                    thiz.selectedPersona = undefined;
                    $("#eliminar").attr("disabled", true);
                    $("#editar").attr("disabled", true);


                },
                error: function (model, response, options) {
                    alert("Ha ocurrido un error!");
                }


            });
        }

    },

    editar: function () {
        if(this.selectedPersona==undefined){
            alert("Seleccione un elemento primero!");
        }else {
            //se inicializa el formulario de alta de personas
            var editarview = new FormularioPersonaView({
                collection: this.collection, id: this.selectedPersona.get('id'),
                el: $("#formulario-editar-persona")
            });
        }
    },
    siguiente: function() {
        var thiz=this;
        if (this.pagina<this.pagMax){

          this.pagina++;
          thiz.collection.fetch({ data: $.param({inicio: (this.pagina-1)*10, cantidad: 10, filtro: this.filtro}),
              success : function(collection, response) {
                  thiz.pagMax=Math.ceil(response.total/10);
                  thiz.view.render();
              }
          });
      }
    },
    anterior: function() {
        var thiz=this;
        if (this.pagina>0){
            this.pagina--;
            thiz.collection.fetch({ data: $.param({inicio: (this.pagina-1)*10, cantidad: 10, filtro: this.filtro}),
                success : function(collection, response) {
                    thiz.pagMax=Math.ceil(response.total/10);
                    thiz.render();
                }
            });
        }
    }


});
_.formatdate = function (stamp) {
    var d = new Date(stamp); // or d = new Date(date)
    return d.getDate()+'-'+(d.getMonth() + 1)+'-'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
};