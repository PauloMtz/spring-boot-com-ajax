$(document).ready(function() {
    moment.locale('pt-br');
    
    var table = $("#table-server").DataTable({
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
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                text: 'Editar',
                attr: {
                    id: 'btn-editar',
                    type: 'button'
                },
                enabled: false
            },
            {
                text: 'Excluir',
                attr: {
                    id: 'btn-excluir',
                    type: 'button'
                },
                enabled: false
            }
        ]
    });

    // ação de desabilitar botoões ao ordernar linhas
    $("#table-server thead").on("click", "tr", function() {
        table.buttons().disable();
    });

    // ação de marcar/desmarcar linhas
    $("#table-server tbody").on("click", "tr", function() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            table.buttons().disable();
        } else {
            $("tr.selected").removeClass("selected");
            $(this).addClass("selected");
            table.buttons().enable();
        }
    });

    $("#btn-editar").on("click", function() {
        if (isSelectedRow()) {
            $("#modal-form").modal("show");
        }
    });

    $("#btn-excluir").on("click", function() {
        if (isSelectedRow()) {
            $("#modal-delete").modal("show");
        }
    });

    $("#btn-del-modal").on("click", function() {
        var id = getPromoId();

        $.ajax({
            method: "GET",
            url: "/promocao/excluir/" + id,
            success: function() {
                $("#modal-delete").modal("hide");
                table.ajax.reload();
            },
            error: function() {
                alert("Ocorreu um erro, tente novamente mais tarde.");
            }
        });
    });

    function getPromoId() {
        return table.row(table.$("tr.selected")).data().id;
    }

    function isSelectedRow() {
        var t_row = table.row(table.$("tr.selected"));
        return t_row.data() !== undefined;
    }
});
