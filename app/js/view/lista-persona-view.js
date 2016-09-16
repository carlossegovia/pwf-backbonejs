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
        "click #filtrar": "filtrar2"
    },
    /**
     * @Constructor
     */
    initialize: function () {
        var thiz = this;
        //cuando el collection cambia, se carga la lista.
        this.collection.on("add", this.render, this);
        this.loadTemplate(function () {
            //una vez descargado el template se invoca al fetch para obtener los datos
            //del collection
            thiz.collection.fetch();
        });
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
                if (myModel.attributes.nombre.search(data["filtrado"])!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Apellido"){
                if (myModel.attributes.apellido.search(data["filtrado"])!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Alias") {
                if (myModel.attributes.alias.search(data["filtrado"])!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="ID") {
                if (myModel.attributes.id.toString().search(data["filtrado"])!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Dirección") {
                if (myModel.attributes.direccion.search(data["filtrado"])!=-1){
                    coleccion.add(myModel);
                }
            }else if(data["sel1"]=="Email") {
                if (myModel.attributes.email.search(data["filtrado"])!=-1){
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
    }
});
