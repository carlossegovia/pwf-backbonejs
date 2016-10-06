/**
 * Model que corresponde al recurso persona.
 */
var globalCounter = 1;
var PersonaModel = Backbone.Model.extend({
    /**
     * Atributos por defecto del model 
     * @field
     */
    defaults: {
        "nombre": "",
        "apellido": "",
        "alias": "",
        "telefono": "",
        "email": "",
        "direccion": "",
        "fechacreacion": "",
        "fechamodificacion": null
    },
    /**
     * Funcion que asigna automaticamente un ID a los modelos que recibe
     * desde el JSON y cualquiera que se agregue
     */

    urlRoot: 'https://desa03.konecta.com.py/pwf/rest/agenda'

});


