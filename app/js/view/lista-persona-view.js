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
        "click #filtrar": "filtrar",
        "click #limpiar": "render"
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
     * Para filtrar los datos de las personas que están en memoria.
     * Actualmente no esta funcionado bien, ya que que realiza una busqueda exacta.
     * Se debe de buscar que el metodo se realice por subString
     */
    filtrar: function () {
        var data = {};
        //por cada input del view
        this.$el.find("[name]").each(function () {
            data[this.name] = this.value;
        });

        if (data["sel1"]=="Nombre"){
            var col = this.collection.where({"nombre":data["filtrado"]});
        }else if(data["sel1"]=="Apellido"){
            var col = this.collection.where({"apellido":data["filtrado"]});
        }else if(data["sel1"]=="Alias") {
            var col = this.collection.where({"alias": data["filtrado"]});
        }else if(data["sel1"]=="ID") {
            var col = this.collection.where({"id": parseInt(data["filtrado"])});
        }else if(data["sel1"]=="Dirección") {
            var col = this.collection.where({"direccion": data["filtrado"]});
        }

        var coll = new PersonaCollection(col);
        var tmpl = _.template(this.template);
        this.$el.html(tmpl({
            collection: coll.toJSON()
        }));
        return this;
    }
});
