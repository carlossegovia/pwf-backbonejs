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
        "click #editar": "editar"
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
        //cuando el collection cambia, se carga la lista.
        this.loadTemplate(function () {
            //una vez descargado el template se invoca al fetch para obtener los datos
            //del collection
            thiz.collection.fetch({
                success : function(collection, response) {
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
            collection: coll
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
        var a_eliminar = this.selectedPersona;
        var thiz= this;
        a_eliminar.destroy({
            dataType : 'text',
            success: function(model, response, options) {
                alert("Se eliminó correctamente!");
                thiz.collection.fetch();
                thiz.selectedPersona=undefined;
            },
            error: function(model, response, options) {
                alert("Ha ocurrido un error!");
            }


        });


    },
    editar: function () {
        Backbone.history.navigate("/editar/"+this.selectedPersona.get('id'), true)


    },

    getPaginacion: function () {
        var Agenda = Backbone.Model.extend({
            urlRoot: 'http://localhost:1337/163.172.218.124/pwf/rest/agenda',
            url: function() {
                var base = _.result(this, 'urlRoot');
                if (this.get('inicio')!=undefined){
                    return base + '?inicio=' + encodeURIComponent(this.get('inicio'))+ '&cantidad=' +
                        encodeURIComponent(this.get('cantidad')) + '&filtro=' + encodeURIComponent(this.get('filtro'));
                }
                return base;
            }
        });

        var myAgenda = new Agenda();
        myAgenda.set('inicio', '0');
        myAgenda.set('cantidad', '10');
        myAgenda.set('filtro', 'car');
        myAgenda.fetch();

        console.log(myAgenda);

    }

});
