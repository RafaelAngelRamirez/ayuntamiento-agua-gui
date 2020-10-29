
import { Component, AfterViewInit } from "@angular/core";
import { GpsService } from "../services/gps.service";
@Component({
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements AfterViewInit {
  subtitle: string;
  constructor(public gpsService: GpsService) {
    this.subtitle = "This is some text within a card block.";
  }

  public lineChartData1: Array<object> = [
    {
      data: [0, 150, 110, 240, 200, 200, 300, 200, 380, 300, 400, 380],
      label: "Incidencias",
    },
  ];

  public lineChartLabels1: Array<string> = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
  ];
  public lineChartOptions1 = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      ],
    },
    lineTension: 10,
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0 } },
  };
  public lineChartColors1: Array<object> = [
    {
      // grey
      backgroundColor: "rgba(6,215,156,0.0)",
      borderColor: "rgba(57,139,247,1)",
      pointBackgroundColor: "rgba(57,139,247,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(57,139,247,0.5)",
    },
    {
      // dark grey
      backgroundColor: "rgba(57,139,247,0.0)",
      borderColor: "rgba(57,139,247,1)",
      pointBackgroundColor: "rgba(57,139,247,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(57,139,247,0.5)",
    },
  ];
  public lineChartLegend1 = false;
  public lineChartType1 = "line";

  // Doughnut
  public doughnutChartLabels: string[] = [
    "Incidencia 1",
    "Incidencia 2",
    "Incidencia 3",
    "Incidencia 4",
  ];
  public doughnutChartOptions = {
    borderWidth: 1,
    maintainAspectRatio: false,
  };
  public doughnutChartData: number[] = [30, 10, 40, 50];
  public doughnutChartType = "doughnut";
  public doughnutChartLegend = false;

  public lineChartData: Array<object> = [
    { data: [0, 5, 6, 8, 25, 9, 8, 24], label: "Site A" },
    { data: [0, 3, 1, 2, 8, 1, 5, 1], label: "Site B" },
  ];
  public lineChartLabels: Array<string> = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ];
  public lineChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          gridLines: {
            color: "rgba(120, 130, 140, 0.13)",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: "rgba(120, 130, 140, 0.13)",
          },
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  public lineChartColors: Array<object> = [
    {
      // grey
      backgroundColor: "rgba(6,215,156,0.1)",
      borderColor: "rgba(6,215,156,1)",
      pointBackgroundColor: "rgba(6,215,156,1)",
      pointBorderColor: "#fff",

      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(6,215,156,0.5)",
    },
    {
      // dark grey
      backgroundColor: "rgba(57,139,247,0.2)",
      borderColor: "rgba(57,139,247,1)",
      pointBackgroundColor: "rgba(57,139,247,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(57,139,247,0.5)",
    },
  ];
  public lineChartLegend = false;
  public lineChartType = "line";
  ngAfterViewInit() {}
}

// <div class="row">
//   <div class="col-md-9">
//     <div class="card">
//       <div class="card-body">
//         <div class="d-flex">
//           <div>
//             <h3 class="card-title m-b-5">
//               <span class="lstick"></span>Incidencias registradas en el tiempo
//             </h3>
//           </div>
//           <div class="ml-auto">
//             <select class="custom-select b-0">
//               <option selected="">Enero 2017</option>
//               <option value="1">Febrero 2017</option>
//               <option value="2">Marzo 2017</option>
//               <option value="3">Abril 2017</option>
//             </select>
//           </div>
//         </div>
//         <div style="height: 300px" class="mt-4">
//           <canvas
//             baseChart
//             [datasets]="lineChartData1"
//             [labels]="lineChartLabels1"
//             [options]="lineChartOptions1"
//             [colors]="lineChartColors1"
//             [legend]="lineChartLegend1"
//             [chartType]="lineChartType1"
//           >
//           </canvas>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div class="col-md-3">
//     <div class="card">
//       <div class="card-body">
//         <h4 class="card-title">
//           <span class="lstick"></span>Cantidad de incidencias
//         </h4>
//         <div style="height: 220px">
//           <canvas
//             baseChart
//             height="100px"
//             [data]="doughnutChartData"
//             [labels]="doughnutChartLabels"
//             [options]="doughnutChartOptions"
//             [legend]="doughnutChartLegend"
//             [chartType]="doughnutChartType"
//             [colors]="[
//               {
//                 backgroundColor: [
//                   'rgb(236, 239, 241)',
//                   'rgb(116, 90, 242)',
//                   'rgb(38, 198, 218)',
//                   'rgb(30, 136, 229)'
//                 ]
//               }
//             ]"
//           >
//           </canvas>
//         </div>
//         <table class="table vm font-14">
//           <tr>
//             <td class="b-0">Ruta 1</td>
//             <td class="text-right font-medium b-0">38.5%</td>
//           </tr>
//           <tr>
//             <td>Ruta 2</td>
//             <td class="text-right font-medium">30.8%</td>
//           </tr>
//         </table>
//       </div>
//     </div>
//   </div>
//   <!-- <div class="col-md-6">
//     <div class="card">
//       <div class="card-body">
//         <h4 class="card-title">
//           <span class="lstick"></span>Usuarios activos
//         </h4>
//         <div class="table-responsive">
//           <table class="table vm no-th-brd pro-of-month mb-0 v-middle">
//             <thead>
//               <tr>
//                 <th colspan="2">Assigned</th>
//                 <th>Name</th>
//                 <th>Priority</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td style="width: 50px;">
//                   <span class="round"
//                     ><img src="assets/images/users/1.jpg" alt="user" width="50"
//                   /></span>
//                 </td>
//                 <td>
//                   <h6 class="mb-0">Sunil Joshi</h6>
//                   <small class="text-muted">Web Designer</small>
//                 </td>
//                 <td>Elite Admin</td>
//                 <td>Low</td>
//               </tr>
//               <tr class="active">
//                 <td>
//                   <span class="round"
//                     ><img src="assets/images/users/2.jpg" alt="user" width="50"
//                   /></span>
//                 </td>
//                 <td>
//                   <h6 class="mb-0">Andrew</h6>
//                   <small class="text-muted">Project Manager</small>
//                 </td>
//                 <td>Real Homes</td>
//                 <td>Medium</td>
//               </tr>
//               <tr>
//                 <td>
//                   <span class="round round-success"
//                     ><img src="assets/images/users/3.jpg" alt="user" width="50"
//                   /></span>
//                 </td>
//                 <td>
//                   <h6 class="mb-0">Bhavesh patel</h6>
//                   <small class="text-muted">Developer</small>
//                 </td>
//                 <td>MedicalPro Theme</td>
//                 <td>High</td>
//               </tr>
//               <tr>
//                 <td>
//                   <span class="round round-primary"
//                     ><img src="assets/images/users/4.jpg" alt="user" width="50"
//                   /></span>
//                 </td>
//                 <td>
//                   <h6 class="mb-0">Nirav Joshi</h6>
//                   <small class="text-muted">Frontend Eng</small>
//                 </td>
//                 <td>Elite Admin</td>
//                 <td>Low</td>
//               </tr>
//               <tr>
//                 <td>
//                   <span class="round round-warning"
//                     ><img src="assets/images/users/5.jpg" alt="user" width="50"
//                   /></span>
//                 </td>
//                 <td>
//                   <h6 class="mb-0">Micheal Doe</h6>
//                   <small class="text-muted">Content Writer</small>
//                 </td>
//                 <td>Helping Hands</td>
//                 <td>High</td>
//               </tr>
//               <tr>
//                 <td>
//                   <span class="round round-danger"
//                     ><img src="assets/images/users/6.jpg" alt="user" width="50"
//                   /></span>
//                 </td>
//                 <td>
//                   <h6 class="mb-0">Johnathan</h6>
//                   <small class="text-muted">Graphic</small>
//                 </td>
//                 <td>Digital Agency</td>
//                 <td>High</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </div> -->
//   <div class="col-md-6">
//     <div class="card">
//       <div class="card-body">
//         <div class="d-flex">
//           <h4 class="card-title">
//             <span class="lstick"></span>Usuarios del sistema
//           </h4>
//         </div>
//         <div class="message-box contact-box">
//           <div class="message-widget contact-widget">
//             <!-- Message -->
//             <a href="#">
//               <div class="user-img">
//                 <img
//                   src="assets/images/users/1.jpg"
//                   alt="user"
//                   class="img-circle"
//                 />
//                 <span class="profile-status online pull-right"></span>
//               </div>
//               <div class="mail-contnet">
//                 <h5>Pavan kumar</h5>
//                 <span class="mail-desc">info@wrappixel.com</span>
//               </div>
//             </a>
//             <!-- Message -->
//             <a href="#">
//               <div class="user-img">
//                 <img
//                   src="assets/images/users/2.jpg"
//                   alt="user"
//                   class="img-circle"
//                 />
//                 <span class="profile-status busy pull-right"></span>
//               </div>
//               <div class="mail-contnet">
//                 <h5>Sonu Nigam</h5>
//                 <span class="mail-desc">pamela1987@gmail.com</span>
//               </div>
//             </a>
//             <!-- Message -->
//             <a href="#">
//               <div class="user-img">
//                 <span class="round">A</span>
//                 <span class="profile-status away pull-right"></span>
//               </div>
//               <div class="mail-contnet">
//                 <h5>Arijit Sinh</h5>
//                 <span class="mail-desc">cruise1298.fiplip@gmail.com</span>
//               </div>
//             </a>
//             <!-- Message -->
//             <a href="#">
//               <div class="user-img">
//                 <img
//                   src="assets/images/users/4.jpg"
//                   alt="user"
//                   class="img-circle"
//                 />
//                 <span class="profile-status offline pull-right"></span>
//               </div>
//               <div class="mail-contnet">
//                 <h5>Pavan kumar</h5>
//                 <span class="mail-desc">kat@gmail.com</span>
//               </div>
//             </a>
//             <!-- Message -->
//             <a href="#">
//               <div class="user-img">
//                 <img
//                   src="assets/images/users/5.jpg"
//                   alt="user"
//                   class="img-circle"
//                 />
//                 <span class="profile-status offline pull-right"></span>
//               </div>
//               <div class="mail-contnet">
//                 <h5>Andrew</h5>
//                 <span class="mail-desc">and@gmail.com</span>
//               </div>
//             </a>
//             <!-- Message -->
//             <a href="#">
//               <div class="user-img">
//                 <img
//                   src="assets/images/users/6.jpg"
//                   alt="user"
//                   class="img-circle"
//                 />
//                 <span class="profile-status offline pull-right"></span>
//               </div>
//               <div class="mail-contnet">
//                 <h5>Jonathan Jones</h5>
//                 <span class="mail-desc">jj@gmail.com</span>
//               </div>
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <!-- <div class="col-md-4">
//     <div class="card">
//       <img
//         class="card-img-top img-responsive"
//         src="assets/images/big/img1.jpg"
//         alt="Card image cap"
//       />
//       <div class="card-body">
//         <h3 class="font-normal">Business development of rules 2017</h3>
//         <span class="label label-info label-rounded">Technology</span>
//         <p class="m-b-0 m-t-20">
//           Titudin venenatis ipsum aciat. Vestibulum ullamcorper quam. nenatis
//           ipsum ac feugiat. Ibulum ullamcorper
//         </p>
//         <div class="d-flex m-t-20">
//           <button class="btn p-l-0 btn-link">Read more</button>
//           <div class="ml-auto align-self-center">
//             <a href="javascript:void(0)" class="link m-r-10"
//               ><i class="fa fa-heart-o"></i
//             ></a>
//             <a href="javascript:void(0)" class="link m-r-10"
//               ><i class="fa fa-share-alt"></i
//             ></a>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div> -->
//   <div class="col-md-8">
//     <div class="card">
//       <div class="card-body">
//         <div class="d-flex">
//           <h4 class="card-title">
//             <span class="lstick"></span>Ejemplo de Grafico
//           </h4>
//           <ul class="list-inline m-b-0 ml-auto">
//             <li>
//               <h6 class="text-muted text-success">
//                 <i class="fa fa-circle font-10 m-r-10"></i>Site A view
//               </h6>
//             </li>
//             <li>
//               <h6 class="text-muted text-info">
//                 <i class="fa fa-circle font-10 m-r-10"></i>Site B view
//               </h6>
//             </li>
//           </ul>
//         </div>
//         <div style="height: 350px" class="mt-4 pt-4">
//           <canvas
//             baseChart
//             [datasets]="lineChartData"
//             [labels]="lineChartLabels"
//             [options]="lineChartOptions"
//             [colors]="lineChartColors"
//             [legend]="lineChartLegend"
//             [chartType]="lineChartType"
//           >
//           </canvas>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

