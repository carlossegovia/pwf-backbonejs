/**
 * Clase que implementa el Formulario de alta de personas.
 * @class
 */
var FormularioPersonaView = Backbone.View.extend({
    /**
     * Url del template que corresponde al view
     * @field
     */
    templateURL: "templates/formulario-persona-tmpl.html",

    /**
     * Atributo que define el mapeo de eventos a handlers
     * @field
     */
    events: {
        "click #guardar": "guardarContacto"
    },

    /**
     * @Constructor
     */
    initialize: function () {
        var thiz = this;
        this.loadTemplate(function () {

            thiz.render();

        });

    },

    /**
     * Se encarga de renderizar el html de la página.
     * @function
     */
    render: function () {
        var contacto = {};
        var thiz=this;


        if (this.id !== undefined) {
            var model = new PersonaModel({id: this.id});
            model.fetch({
                success: function(response){

                    contacto = response.toJSON();
                    var tmpl = _.template(thiz.template);
                    //se añade el html resultante al contenedor del view.
                    thiz.$el.html(tmpl({
                        contacto: contacto
                    }));
                    return thiz;
                } ,
                error: function(model, response){
                    alert("Ya no existe el contacto");
                    return thiz;
                }

            });

        }else{
            var tmpl = _.template(this.template);
            //se añade el html resultante al contenedor del view.
            this.$el.html(tmpl({
                contacto: contacto
            }));
            return this;
        }
    },

    /**
     * Se encarga de añade el nuevo dato al collection que se encuentra en memoria.
     * @function
     */
    guardarContacto: function () {
        var data = {};
        var thiz=this;
        //por cada input del view
        this.$el.find("[name]").each(function () {
            data[this.name] = this.value;
        });

        //validación
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(data["nombre"]==""){
            alert("El campo de nombre no puede estar vacío");
            return false;
        }else if(data["apellido"]==""){
            alert("El campo de apellido no puede estar vacío");
            return false;
        }else if(data["telefono"]==""){
            alert("El campo de telefono no puede estar vacío");
            return false;
        }else if(data["email"]=="") {
            alert("El campo de email no puede estar vacío");
            return false;
        }else if (reg.test(data["email"])==false){
            alert("El campo de email no es valido, se debe seguir el siguiente formato de ejemplo: example@gmail.com");
            return false;
        }
        var r = confirm("Está seguro?");
        if (r==false){
            return false;
        }
        var modificar=false;
        var today = new Date();
        if (this.id!=undefined){
            data["fechamodificacion"] = today.toISOString().substring(0, 10);
            data["id"] = this.id;

        }else{
            data["fechacreacion"] = today.toISOString().substring(0, 10);
            modificar=true;
        }
        var model = new PersonaModel(data);

        model.save(null, {
            success: function(model, response) {
                alert("Se agregó correctamente!");
                thiz.undelegateEvents();
                thiz.stopListening();
                notificacion.trigger("alert");

            },
            error: function(model, response) {
                alert("Ha ocurrido un error!");
            },
            wait: true

        });

    }
});
