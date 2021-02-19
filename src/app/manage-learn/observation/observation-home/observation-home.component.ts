import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLinks } from '@app/app/app.constant';
import { AppGlobalService, AppHeaderService } from '@app/services';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { ObservationService } from '../observation.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService, UtilsService } from '../../core';
import { urlConstants } from '../../core/constants/urlConstants';
import { AssessmentApiService } from '../../core/services/assessment-api.service';
import { KendraApiService } from '../../core/services/kendra-api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-observation-home',
  templateUrl: './observation-home.component.html',
  styleUrls: ['./observation-home.component.scss'],
})
export class ObservationHomeComponent implements OnInit {
  private backButtonFunc: Subscription;
  headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [],
  };
  // programList: any;
  solutionList: any;
  page = 1;
  limit = 10;
  count: any;

  constructor(
    private httpClient: HttpClient,
    private location: Location,
    private headerService: AppHeaderService,
    private platform: Platform,
    private router: Router,
    private observationService: ObservationService,
    private utils: UtilsService,
    private assessmentService: AssessmentApiService, // private kendraService: KendraApiService
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.solutionList = [];
    this.getPrograms();
  }
  async getPrograms() {
    let payload = await this.utils.getProfileInfo();
    if (payload) {
      this.loader.startLoader();
      const config = {
        url: urlConstants.API_URLS.GET_PROG_SOL_FOR_OBSERVATION + `?page=${this.page}&limit=${this.limit}`,
        payload: payload,
      };
      this.assessmentService.post(config).subscribe(
        (success) => {
          this.loader.stopLoader();
          console.log(success);
          if (success && success.result && success.result.data) {
            this.count = success.result.count;

            this.solutionList = [...this.solutionList, ...success.result.data];
          }
        },
        (error) => {
          this.solutionList = [];
          this.loader.stopLoader();
        }
      );
    }
  }

  ionViewWillEnter() {
    this.headerConfig = this.headerService.getDefaultPageConfig();
    this.headerConfig.actionButtons = [];
    this.headerConfig.showHeader = true;
    this.headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this.headerConfig);
  }

  ionViewWillLeave() {
    if (this.backButtonFunc) {
      this.backButtonFunc.unsubscribe();
    }
  }

  observationDetails(solution) {
    let { programId, solutionId, _id: observationId, name: solutionName } = solution;
    // this.observationService.setIndex(programIndex, solutionIndex);
    this.router.navigate([`/${RouterLinks.OBSERVATION}/${RouterLinks.OBSERVATION_DETAILS}`], {
      queryParams: {
        programId: programId,
        solutionId: solutionId,
        observationId: observationId,
        solutionName: solutionName,
      },
    });
    /*  this.navCtrl.push(ProgramSolutionObservationDetailPage, {
      programIndex: this.programIndex,
      solutionIndex: this.solutionIndex,
    }); */
  }
  loadMore() {
    this.page = this.page + 1;
    this.getPrograms();
  }
}
