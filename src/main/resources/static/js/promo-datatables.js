$(document).ready(function() {
    moment.locale('pt-br');
    
    $("#table-server").DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        lengthMenu: [5, 10, 15, 20],
        ajax: {
            url: "/promocao/datatable/server",
            data: "data"
        },
        columns: [
            {data: 'id'},
            {data: 'titulo'},
            {data: 'site'},
            {data: 'linkPromocao'},
            {data: 'descricao'},
            {data: 'linkImagem'},
            {data: 'preco', render: $.fn.dataTable.render.number('.', ',', 2, 'R$ ')},
            {data: 'likes'},
            {data: 'dataCadastro', render: function(dataCadastro) {
                return moment(dataCadastro).format('LLL')
            }},
            {data: 'categoria.titulo'},
        ]
    });
});