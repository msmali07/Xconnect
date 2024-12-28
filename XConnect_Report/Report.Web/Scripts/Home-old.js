var app = angular.module('homeapp', []);

app.controller('homeCntr', ['$scope', '$http', '$window', function ($scope, $http, $window)
{
    //GetHomeDetails();
    
    $scope.GetHomeDetails = function (data) {
       
       $scope.HomeList = data;


            $scope.BookingCount = data.BookingCountList;
            $scope.TopAgencyList = data.AgencyList;
            $scope.BookingsountList2 = data.YearlyBookingList;
            $scope.TopSupplierList = data.SupplierList;

           


            PopUpController.ClosePopup("divPopup", "");
            $("#Homediv")[0].style.display = "block";
            

     
       
    }

    $scope.getChartData= function() {
      
       
        var data = [];
        data.push($scope.HomeList.Table);
      
        var labels = $scope.HomeList.Table[0]["cCompanyName"];
        renderChart(data, labels);
        renderChart2();
       // renderPiechart();
        renderPiechart2();
       
        Googlecolchart();
        Googlecolchart2();
        Googlecolchart3()
      
           
    }

    function float2dollar(value) {
        return "U$ " + (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    function renderChart(data, labels) {

        var lineChartData = { labels: ['1','2','3','4','5'], datasets: [] };

        $scope.HomeList.Table.forEach(function (a, i) {
            lineChartData.datasets.push({
                label: 'Label ' + i,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                data: (a["cCompanyName"])
            });
        });

        console.log(lineChartData);

     var ctx = document.getElementById("myChart").getContext('2d');
     var test = { labels: [], datas: [] };

   $scope.HomeList.Table.forEach(function (a, i) {
       test.datas.push((a["BookingCount"])),
       test.labels.push((a["cCompanyName"]));;
        });
      
   console.log(test);

   var myChart = new Chart(ctx, {
       type: 'bar',
           
            data: {
               // labels: ['1', '2', '3', '4', '5'],   //companyname
                labels: test.labels,   //companyname
                    datasets: [
                      {
                       label: 'Booking Count',  //indication
                      // data: ["12", "34", "56", "67", "89"],  //
                       data: test.datas,  //bookingcount
                       borderColor: 'rgba(75, 192, 192, 1)',
                       backgroundColor: '#00BCD4',
                     },
         
            ]
          },

          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
         });

      
   }


    function renderChart2() {

      

        var ctx = document.getElementById("myChart2").getContext('2d');

        var test = { labels: [] };
        $scope.MonthwiseBooking.forEach(function (a, i) {
            test.labels.push((a["BookingMonth"]));;

        });


        var Final = [];
        $scope.YearwiseBooking.forEach(function (a, i) {
            var datas2 = [];
            a.list.forEach(function (b, j) {
                //  test2.datas2.push((a.list[j]["BookingCount"]));;
                datas2.push((b["BookingCount"]));;
            });
            Final.push(datas2);
        });



        console.log("yealist");
        console.log(Final);

          

        var myChart = new Chart(ctx, {
            type: 'bar',

            data: {
                
                labels: test.labels,   //companyname
                datasets: [
                  {
                      label: 'Year 2015',  //indication
                      data: Final[0], 
                      //data: test.datas[0],  //bookingcount
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: '#db7093',
                  },
                   {
                       label: 'Year 2016',  //indication
                       data: Final[1], 
                      // data: test.datas[1],  //bookingcount
                       borderColor: 'rgba(75, 192, 192, 1)',
                       backgroundColor: '#6a5acd',
                   },
                    {
                        label: 'Year 2017',  //indication
                        data: Final[2],
                       // data: test.datas[2],  //bookingcount
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: '#ffd700',
                    },
                     {
                         label: 'Year 2018',  //indication
                         data: Final[3],
                       //  data: test.datas[3],  //bookingcount
                         borderColor: 'rgba(75, 192, 192, 1)',
                         backgroundColor: '#e9967a',
                     },
                      {
                          label: 'Year 2019',  //indication
                          data: Final[4],
                        //  data: test.datas[4],  //bookingcount
                          borderColor: 'rgba(75, 192, 192, 1)',
                          backgroundColor: '#7fff00',
                      },
                       {
                           label: 'Year 2020',  //indication
                           data: Final[5],
                           //  data: test.datas[4],  //bookingcount
                           borderColor: 'rgba(75, 192, 192, 1)',
                           backgroundColor: '#00BCD4',
                       },

                ]
            },

            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Bookings'
                        }
                    }]
                }
            }
        });


    }

    function renderPiechart()
    {

        var test = { labels: [], datas: [] };

        $scope.HomeList.Table.forEach(function (a, i) {
            test.datas.push((a["BookingCount"])),
            test.labels.push((a["cCompanyName"]));;
        });

        var ctx = document.getElementById("countries").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {

                labels: test.labels,   //companyname
                datasets: [
                  {
                      label: 'Booking Count',  //indication
                     
                      data: test.datas,  //bookingcount
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: [
                         "#2ecc71",
                         "#3498db",
                         "#95a5a6",
                         "#9b59b6",
                         "#f1c40f",
                         "#e74c3c",
                         "#34495e"
                      ],
                  },
                  
                ]
            },

            options: {
                segmentShowStroke: false,
                animateScale: true
            }
        });
    }

    function renderPiechart2() {

        var test = { labels: ['Hotel', 'Transfer', 'Tour'], datas: [$scope.HomeList.Table1[0]["HotelCount"], $scope.HomeList.Table1[0]["TransferCount"], $scope.HomeList.Table1[0]["TourCount"]] };

       
        var ctx = document.getElementById("services").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {

                labels: test.labels,   //companyname
                datasets: [
                  {
                      label: 'Booking Count',  //indication

                      data: test.datas,  //bookingcount
                     // borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: [
                         "#ffb6c1",
                         "#48d1cc",
                         "#9932cc",
                         "#9b59b6",
                         "#f1c40f",
                         "#e74c3c",
                         "#34495e"
                      ],
                  },

                ]
            },

            options: {
                segmentShowStroke: false,
                animateScale: true,
               
               // plugins: {
                  //  datalabels: {
                     //   formatter: (value, ctx) => {
                         //   let datasets = ctx.chart.data.datasets;
                          //  if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                            //    let sum = datasets[0].data.reduce((a, b) => a + b, 0);
                             //   let percentage = Math.round((value / sum) * 100) + '%';
                              //  return percentage;
                           // } else {
                           //     return percentage;
                           // }
                        //},
                       // color: '#fff',
                   // }
              //  }

                tooltips: {
            callbacks: {
            label: function (tooltipItem, data) {
                //get the concerned dataset
            var dataset = data.datasets[tooltipItem.datasetIndex];
                //calculate the total of this data set
            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
            });
                //get the current items value
            var currentValue = dataset.data[tooltipItem.index];
                //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
            var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

            return  percentage + "%";
        }
    }
}
            }
        });
    }

    function Googlecolchart()
    {
        var Memberlist = { labels: [], datas: [] };
        $scope.HomeList.Table.forEach(function (a, i) {
            Memberlist.datas.push((a["BookingCount"])),
            Memberlist.labels.push((a["cCompanyName"]));;
        });


        console.log(Memberlist);
        // Define the chart to be drawn.
        var data = google.visualization.arrayToDataTable([
           ['Company Name', 'Booking Count'],
           [Memberlist.labels[0], Memberlist.datas[0]],
           [Memberlist.labels[1], Memberlist.datas[1]],
           [Memberlist.labels[2], Memberlist.datas[2]],
           [Memberlist.labels[3], Memberlist.datas[3]],
           [Memberlist.labels[4], Memberlist.datas[4]]

        ]);

       var options = {title: ''}; 
       
        // Instantiate and draw the chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('container'));
        chart.draw(data, options);
        
    }

    function Googlecolchart2() {
      

        var data = google.visualization.arrayToDataTable([
           ['Month', '2015', '2016','2017','2018','2019','2020'],
               ['Jan', 1114, 1270, 7482, 7827, 9791, 13146],
               ['Feb', 1452, 1806, 7490, 9754, 12972, 13325],
               ['Mar', 2492, 2711, 11335, 13877, 18973, 2357],
               ['Apr', 4406, 5153, 14682, 18774, 23496, 84],
               ['May', 5409, 6543, 17010, 22836, 28194, 115],
               ['Jun', 4105, 5250, 12749, 16798, 22206, 130],
               ['Jul', 2985, 4086, 11581, 13914, 20315, 297],
               ['Aug', 2435, 3994, 10148, 11829, 15879, 413],
               ['Sep', 2490, 5043, 10266, 12236, 16568, 492, ],
               ['Oct', 2096, 6734, 8245, 11579, 14124, 0],
               ['Nov', 1521, 6941, 8482, 8690, 13847, 0],
               ['Dec', 1262, 6901, 7732, 8863, 12856, 0]

        ]);

        var options = { title: '' };

        // Instantiate and draw the chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('container2'));
        chart.draw(data, options);
        
    }
    function Googlecolchart3() {

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Services');
        data.addColumn('number', 'Booking Count');
        data.addRows([
           ['Hotel', 339690],
           ['Transfer', 49695],
           ['Tour', 129820],
          
        ]);

        // Set chart options
        var options = {
            'title': '',
            'width': 550,
            'height': 400
        };

        // Instantiate and draw the chart.
        var chart = new google.visualization.PieChart(document.getElementById('container3'));
        chart.draw(data, options);

    }

}]);

function GetHomeDetails(ResultList) {
    var scope = angular.element(document.getElementById("MainWrap")).scope();
    scope.$apply(function () {
        scope.GetHomeDetails(ResultList);
    })
    return;
}