/**
 * Collection de presonas, para simplificar el ejemplo se utiliza un archivo como
 * fuente de datos para simular el GET para obtener los datos.
 */
var PersonaCollection = Backbone.Collection.extend({
    model: PersonaModel,
    url: 'https://163.172.218.124/pwf/rest/agenda',

    parse: function(data) {
        return data.lista;
    }
});
