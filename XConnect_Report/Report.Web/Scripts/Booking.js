var app = angular.module('Bookingapp', []);

app.controller('bookingCntr', ['$scope', '$http', '$window', function ($scope, $http, $window)
{

    $scope.SearchReportClick= function()
       {    
        PopUpController.OpenPopup2("divPopup", "");
        $http.get("../Home/GetReportDetail").then(function (d) {

            $scope.rptList =(d.data);

            console.log($scope.rptList);

            var groupColumn = 4;

            $('#AccountReport').DataTable({

             
                dom: 'Bfrtip',
                buttons: [
                    'print',
                    'excel',
                    'pdf'
                ],
                "columnDefs": [
                    { "visible": false, "targets": groupColumn }
                ],
                ordering: true,
                searching: true,
                paging: true,
                data: d.data,
                "pageLength": 500,
               
                select: true,
               // orderFixed: [[2, 'asc']],
                order: [[4]],
                rowGroup: {
                    dataSrc: [4]
                },
                columns: [
                       { data: 'BookRefNo' },
                       { data: 'ChkInDateStr' },
                       { data: 'noofnts' },
                       { data: 'FirstName' },
                       { data: 'type' },
                       { data: 'HotelName' },
                       { data: 'ClientName' },
                        { data: 'SellAmount' },
                        { data: 'SellCurrency' },
                       { data: 'Bookstatus' }
                ],
              
                //initComplete: function () {
                //    this.api().columns([0, 2, 3]).every(function () {
                //        var column = this;
                //        var select = $('<select class="form-control"><option value=""></option></select>')
                //            .appendTo($(column.footer()).empty())
                //            .on('change', function () {
                //                var val = $(this).val();
                //                column.search(this.value).draw();
                //            });

                //        // Only contains the *visible* options from the first page
                //        console.log(column.data().unique());

                //        // If I add extra data in my JSON, how do I access it here besides column.data?
                //        column.data().unique().sort().each(function (d, j) {
                //            select.append('<option value="' + d + '">' + d + '</option>')
                //        });
                //    });
                //},

                drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="9" style="border: 1px solid black !important;font-weight:700;color:#000000;">' + group + '</td></tr>'
                        );

                        last = group;
                    }
                });
            }
              


            });
            PopUpController.ClosePopup("divPopup", "");
           

        }, function (error) {
            ErrorPopup.render('Error');
        });

       

    }
    $('#msds-select').change(function () {
        var oTable = $('#AccountReport').dataTable();
        oTable.fnFilter($(this).val());
    });
   

    $scope.fnShowHide = function(iCol) {
        /* Get the DataTables object again - this is not a recreation, just a get of the object */
        var oTable = $('#AccountReport').dataTable();

        var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
        oTable.fnSetColumnVis(iCol, bVis ? false : true);

       // oTable.fnFilter("Tour");
        //for filter by value
        oTable.fnFilter("CANCELLED", 9);
        oTable.fnFilter("REQUESTED", 9);
       
        //for clear filter
       // oTable.fnFilterClear();
    }

    $scope.GroupBy = function (iCol) {
        /* Get the DataTables object again - this is not a recreation, just a get of the object */
      
       
       

        var oTable = $('#AccountReport').DataTable();
       oTable.rowGroup().dataSrc($(this).data(iCol));

       

    }


    var filterIndexes = [3, 4];
    $('th', '#filter').each(function (i) {
        var oTable = $('#AccountReport').dataTable();
        if ($.inArray(i, filterIndexes) != -1) {
            this.innerHTML = fnCreateSelect(oTable.fnGetColumnData(i));
            $('select', this).change(function () {
                oTable.fnFilter($(this).val(), i);
            });
        }
    });

    function fnCreateSelect(aData) {
        return '<select><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select>';
    }

  
    
}]);



