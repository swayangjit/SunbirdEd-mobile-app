import {SignInCardComponent} from './sign-in-card.component';
import {ProfileService, AuthService, SharedPreferences, Profile, ProfileType, ProfileSource, SignInError} from '@project-sunbird/sunbird-sdk';
import {
    CommonUtilService, AppGlobalService, TelemetryGeneratorService,
    ContainerService, FormAndFrameworkUtilService
} from '../../../services';
import {NavController} from '@ionic/angular';
import {Events} from '../../../util/events';
import {NgZone} from '@angular/core';
import {of, throwError} from 'rxjs';
import {SbProgressLoader} from '../../../services/sb-progress-loader.service';
import {Router} from '@angular/router';
import {SegmentationTagService} from '../../../services/segmentation-tag/segmentation-tag.service';
import {RouterLinks} from '../../../app/app.constant';
import { App } from '@capacitor/app';

jest.mock('@project-sunbird/sunbird-sdk', () => {
    const actual = jest.requireActual('@project-sunbird/sunbird-sdk');
    return {
        ...actual,
        WebviewLoginSessionProvider() {
        }
    };
});

jest.mock('../../../app/module.service', () => {
    const actual = jest.requireActual('../../../app/module.service');
    return {
        ...actual,
        initTabs: jest.fn().mockImplementation(() => {
        })
    };
});

describe('SignInCardComponent', () => {
    let signInCardComponent: SignInCardComponent;
    const mockAppVersion = App
    const mockRouter: Partial<Router> = {};
    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateInteractTelemetry: jest.fn()
    };

    beforeAll(() => {
        signInCardComponent = new SignInCardComponent(
            mockRouter as Router,
            mockTelemetryGeneratorService as TelemetryGeneratorService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a instance of SignInCardComponent', () => {
        expect(signInCardComponent).toBeTruthy();
    });

    describe('sign-in', () => {
        it('should check for the source and then navigate to sign-in page', () => {
            // arrange
            mockRouter.navigate = jest.fn();
            mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn()
            // act
            signInCardComponent.signIn({source: 'profile'});
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith([RouterLinks.SIGN_IN], {state: {source: 'profile'}});
        });
    });
});
