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

    // abre o modal de edição
    $("#btn-editar").on("click", function() {
        if (isSelectedRow()) {
            var id = getPromoId();

            $.ajax({
                method: "GET",
                url: "/promocao/editar/" + id,
                beforeSend: function() {
                    // remove mensagens se houver
                    $("span").closest(".error-span").remove();

                    // remove bordas vermelhas se houver
                    $(".is-invalid").removeClass("is-invalid");
                    $("#modal-form").modal("show");
                },
                success: function(data) {
                    $("#edt_id").val(data.id);
                    $("#edt_site").val(data.site);
                    $("#edt_titulo").val(data.titulo);
                    $("#edt_descricao").val(data.descricao);
                    $("#edt_preco").val(data.preco.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2
                    }));
                    $("#edt_categoria").val(data.categoria.id);
                    $("#edt_linkImagem").val(data.linkImagem);
                    $("#edt_imagem").attr("src", data.linkImagem);
                },
                error: function() {
                    alert("Ocorreu um erro interno, tente novamente mais tarde.");
                }
            });

            $("#modal-form").modal("show");
        }
    });

    // carrega modal de confirmação de exclusão
    $("#btn-excluir").on("click", function() {
        if (isSelectedRow()) {
            $("#modal-delete").modal("show");
        }
    });

    // botão de confirma exclusão no modal
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

    // edita os dados através do modal
    $("#btn-edit-modal").on("click", function() {

        // recebe os dados do formulário e armazena na variável promo
        var promo = {};
        promo.descricao = $("#edt_descricao").val();
        promo.preco = $("#edt_preco").val();
        promo.titulo = $("#edt_titulo").val();
        promo.categoria = $("#edt_categoria").val();
        promo.linkImagem = $("#edt_linkImagem").val();
        promo.id = $("#edt_id").val();

        $.ajax({
            method: "POST",
            url: "/promocao/editar",
            data: promo,
                beforeSend: function() {
                // removendo as mensagens
                $("span").closest(".error-span").remove();

                // removendo as bordas vermelhas
                $(".is-invalid").removeClass("is-invalid");
            },
            success: function() {
                $("#modal-form").modal("hide");
                table.ajax.reload();
            },
            statusCode: {
                422: function(xhr) {
                    console.log(">>> Status error: ", xhr.status);
                    var errors = $.parseJSON(xhr.responseText);
                    $.each(errors, function(key, val) {
                        $("#edt_" + key).addClass("is-invalid");
                        $("#error-" + key)
                            .addClass("invalid-feedback")
                            .append("<span class='error-span'>" + val + "</span>");
                    });
                }
            }
        });
    });

    // altera a imagem
    $("#edt_linkImagem").on("change", function() {
        // esse $(this) se refere ao $("#edt_linkImagem")
        var link = $(this).val();
        $("#edt_linkImagem").attr("src", link);
    });

    function getPromoId() {
        return table.row(table.$("tr.selected")).data().id;
    }

    function isSelectedRow() {
        var t_row = table.row(table.$("tr.selected"));
        return t_row.data() !== undefined;
    }
});
