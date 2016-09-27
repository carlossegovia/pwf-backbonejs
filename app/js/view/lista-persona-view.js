/**
 * Clase que implementa el listado de personas.
 * @class
 */
var ListaPersonaView = Backbone.View.extend({
    /**
     * Url del template que corresponde al view
     * @field
     */
    templateURL: "templates/lista-persona-tmpl.html",

    events: {
        "click #limpiar": "render",
        "click #filtrar": "filtrar2",
        "click #tr1": "clicked",
        "click #eliminar": "eliminar",
        "click #pag": "getPaginacion",
        "click #editar": "editar",
        "click #siguiente": "siguiente",
        "click #anterior": "anterior"
    },

    clicked: function(e){
        e.preventDefault();
        var id = $(e.currentTarget).data("id");
        this.selectedPersona = this.collection.get(id);
        console.log(id);
        thisParent = $(e.target).parent();
        thisParent.siblings('.active').removeClass('active');
        thisParent.addClass('active');

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
        var data = {};
        //por cada input del view
        this.$el.find("[name]").each(function () {
            data[this.name] = this.value;
        });

        //Aquí se realizan los principales calculos de busqueda
        var myModel;
        var coleccion = new PersonaCollection();
        for(var i=0; i<this.collection.length; i++) {
            myModel = this.collection.models[i];
            if (data["sel1"]=="Nombre"){
                if (myModel.attributes.nombre.toLowerCase().search(data["filtrado"].toLowerCase())!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Apellido"){
                if (myModel.attributes.apellido.toLowerCase().search(data["filtrado"].toLowerCase())!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Alias") {
                if (myModel.attributes.alias.toLowerCase().search(data["filtrado"].toLowerCase())!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="ID") {
                if (myModel.attributes.id.toString().search(data["filtrado"])!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Dirección") {
                if (myModel.attributes.direccion.toLowerCase().search(data["filtrado"].toLowerCase())!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Email") {
                if (myModel.attributes.email.toLowerCase().search(data["filtrado"].toLowerCase())!=-1){
                    coleccion.add(myModel);
                }
            }
        }

        //Para renderizar los resultados de la busqueda
        var tmpl = _.template(this.template);
        this.$el.html(tmpl({
            collection: coleccion.toJSON()
        }));
        return this;
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
            Backbone.history.navigate("/editar/" + this.selectedPersona.get('id'), true);
            this.selectedPersona = undefined;
        }

    },
    siguiente: function() {
        var thiz=this;
        if (this.pagina<this.pagMax){

          this.pagina++;
          thiz.collection.fetch({ data: $.param({inicio: (this.pagina-1)*10, cantidad: 10, filtro: this.filtro}),
              success : function(collection, response) {
                  thiz.pagMax=Math.ceil(response.total/10);
                  thiz.render();
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
