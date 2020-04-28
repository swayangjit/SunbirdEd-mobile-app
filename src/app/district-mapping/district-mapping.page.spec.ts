import { DistrictMappingPage } from '../district-mapping/district-mapping.page';
import {
    AppGlobalService, AppHeaderService, CommonUtilService,
    FormAndFrameworkUtilService, TelemetryGeneratorService
} from '../../services';
import { InteractSubtype, PageId, Environment } from '@app/services/telemetry-constants';
import { DeviceRegisterService } from '../../../../sunbird-mobile-sdk/src/device-register';
import { DeviceInfo } from '../../../../sunbird-mobile-sdk/src/util/device';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Events, Platform } from '@ionic/angular';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { ExternalIdVerificationService } from '../../services/externalid-verification.service';
import { SharedPreferences } from '../../../../sunbird-mobile-sdk/src/util/shared-preferences';
import { EMPTY, of, throwError } from 'rxjs';
import { LocationSearchResult } from '../../../../sunbird-mobile-sdk/src/profile/def/location-search-result';
import { ProfileService, Profile, ProfileType, ProfileSource, DeviceRegisterResponse } from 'sunbird-sdk';
import { PreferenceKey } from '@app/app/app.constant';

describe('DistrictMappingPage', () => {
    let districtMappingPage: DistrictMappingPage;
    const mockHeaderService: Partial<AppHeaderService> = {
        hideHeader: jest.fn()
    };
    const presentFn = jest.fn(() => Promise.resolve());
    const mockCommonUtilService: Partial<CommonUtilService> = {
        translateMessage: jest.fn(() => ''),
        showToast: jest.fn(),
        isDeviceLocationAvailable: jest.fn(() => undefined)
    };
    const profile: Profile = {
        uid: '12345',
        handle: 'sample_profile',
        source: ProfileSource.SERVER,
        profileType: ProfileType.TEACHER
    };
    const mockProfileService: Partial<ProfileService> = {
        searchLocation: jest.fn(() => of([])),
        updateServerProfile: jest.fn(() => of(profile))
    };
    const mockPreferences: Partial<SharedPreferences> = {
        putString: jest.fn(() => of(undefined))
    };
    const mockDeviceRegisterService: Partial<DeviceRegisterService> = {
        registerDevice: jest.fn(() => of({} as DeviceRegisterResponse))
    };
    const mockDeviceInfo: Partial<DeviceInfo> = {};
    const mockFormAndFrameworkUtilService: Partial<FormAndFrameworkUtilService> = {};
    const mockRouter: Partial<Router> = {
        navigate: jest.fn()
    };
    const mockLocation: Partial<Location> = {
        back: jest.fn()
    };
    const mockAppGlobalService: Partial<AppGlobalService> = {
        isUserLoggedIn: jest.fn(() => true),
        getCurrentUser: jest.fn(() => profile),
        closeSigninOnboardingLoader: jest.fn()
    };
    const mockEvents: Partial<Events> = {
        publish: jest.fn()
    };
    const mockPlatform: Partial<Platform> = {};
    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateImpressionTelemetry: jest.fn(),
        generateInteractTelemetry: jest.fn(),
        generateBackClickedTelemetry: jest.fn()
    };
    const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {};
    const mockNgZone: Partial<NgZone> = {
        run: jest.fn((fn) => fn())

    };
    const mockExternalIdVerificationService: Partial<ExternalIdVerificationService> = {
        showExternalIdVerificationPopup: jest.fn()
    };

    beforeAll(() => {
        mockRouter.getCurrentNavigation = jest.fn(() => {
            return {
                extras: {}
            };
        });

        mockDeviceInfo.isKeyboardShown = jest.fn(() => {
            return EMPTY;
        });

        districtMappingPage = new DistrictMappingPage(
            mockProfileService as ProfileService,
            mockPreferences as SharedPreferences,
            mockDeviceRegisterService as DeviceRegisterService,
            mockDeviceInfo as DeviceInfo,
            mockHeaderService as AppHeaderService,
            mockCommonUtilService as CommonUtilService,
            mockFormAndFrameworkUtilService as FormAndFrameworkUtilService,
            mockRouter as Router,
            mockLocation as Location,
            mockAppGlobalService as AppGlobalService,
            mockEvents as Events,
            mockPlatform as Platform,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockChangeDetectionRef as ChangeDetectorRef,
            mockNgZone as NgZone,
            mockExternalIdVerificationService as ExternalIdVerificationService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create instance of DistrictMappingPage', () => {
        expect(districtMappingPage).toBeTruthy();
    });

    it('should open select overlay when showStates is set', (done) => {
        // arrange
        districtMappingPage.stateSelect = { open: jest.fn(() => { }) };

        // act
        districtMappingPage.showStates = true;

        // assert
        setTimeout(() => {
            expect(districtMappingPage.stateSelect.open).toHaveBeenCalledTimes(1);
            done();
        }, 510);
    });

    it('should open select overlay when showDistrict is set', (done) => {
        // arrange
        districtMappingPage.districtSelect = { open: jest.fn(() => { }) };

        // act
        districtMappingPage.showDistrict = true;

        // assert
        setTimeout(() => {
            expect(districtMappingPage.districtSelect.open).toHaveBeenCalledTimes(1);
            done();
        }, 510);
    });

    it('should populate the state name when getStates() is invoked ', () => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');
        const dismissFn = jest.fn(() => Promise.resolve());
        mockCommonUtilService.getLoader = jest.fn(() => ({
            present: presentFn,
            dismiss: dismissFn,
        }));
        const locationSearchResult: LocationSearchResult[] = [{ code: '2', name: 'Odisha', id: '12345', type: 'state' }];
        jest.spyOn(mockProfileService, 'searchLocation').mockReturnValue(of(locationSearchResult));
        districtMappingPage.availableLocationState = 'Odisha';
        districtMappingPage.availableLocationDistrict = 'Odisha';
        districtMappingPage.isAutoPopulated = true;
        // act
        districtMappingPage.getStates();

        // assert
        setTimeout(() => {
            expect(districtMappingPage.stateList).toBeDefined();
            expect(districtMappingPage.stateName).toBeDefined();
        }, 0);

    });

    it('should generate TELEMETRY when device back clicked', () => {
        // arrange
        const subscribeWithPriorityData = jest.fn((_, fn) => fn());
        mockPlatform.backButton = {
            subscribeWithPriority: subscribeWithPriorityData,

        } as any;
        window.history.replaceState({ source: 'guest-profile', isShowBackButton: true }, 'MOCK');
        // act
        districtMappingPage.handleDeviceBackButton();
        // assert
        expect(mockTelemetryGeneratorService.generateBackClickedTelemetry).toHaveBeenCalledWith(
            PageId.DISTRICT_MAPPING, Environment.USER, false);
    });

    it('should unsubscribe backButtonFunc in ionViewWillLeave', () => {
        // arrange
        districtMappingPage.backButtonFunc = {
            unsubscribe: jest.fn(),

        } as any;
        // act
        districtMappingPage.ionViewWillLeave();
        // assert
        expect(districtMappingPage.backButtonFunc.unsubscribe).toHaveBeenCalled();
    });

    it('shouldn\'t populate district when state value is not available  ', (done) => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');
        const dismissFn = jest.fn(() => Promise.resolve());
        mockCommonUtilService.getLoader = jest.fn(() => ({
            present: presentFn,
            dismiss: dismissFn,
        }));
        const locationSearchResult: LocationSearchResult[] = [];
        jest.spyOn(mockProfileService, 'searchLocation').mockReturnValue(of(locationSearchResult));
        // act
        districtMappingPage.getStates();

        // assert
        setTimeout(() => {
            expect(districtMappingPage.districtList).toEqual([]);
            expect(districtMappingPage.showDistrict).toBeTruthy();
            done();
        }, 1);

    });

    it('shouldn\'t populate district when state value is not available  ', (done) => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');
        const dismissFn = jest.fn(() => Promise.resolve());
        mockCommonUtilService.getLoader = jest.fn(() => ({
            present: presentFn,
            dismiss: dismissFn,
        }));
        const locationSearchResult: LocationSearchResult[] = [{ code: '2', name: 'Karnataka', id: '12345', type: 'state' }];
        jest.spyOn(mockProfileService, 'searchLocation').mockReturnValue(of(locationSearchResult));
        districtMappingPage.availableLocationDistrict = 'Cuttack';
        // act
        districtMappingPage.getDistrict('');

        // assert
        setTimeout(() => {
            expect(districtMappingPage.districtName).toEqual('');
            done();
        }, 1);

    });

    it('should show districtList if availableLocationDistrict is not available ', (done) => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');
        const dismissFn = jest.fn(() => Promise.resolve());
        mockCommonUtilService.getLoader = jest.fn(() => ({
            present: presentFn,
            dismiss: dismissFn,
        }));
        const locationSearchResult: LocationSearchResult[] = [{ code: '2', name: 'Odisha', id: '12345', type: 'state' }];
        jest.spyOn(mockProfileService, 'searchLocation').mockReturnValue(of(locationSearchResult));
        districtMappingPage.availableLocationDistrict = undefined;
        // act
        districtMappingPage.getDistrict('');

        // assert
        setTimeout(() => {
            expect(districtMappingPage.showDistrict).toBeTruthy();
            done();
        }, 1);

    });

    it('should show  NODATA toast if district list is not available', (done) => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');
        const dismissFn = jest.fn(() => Promise.resolve());
        mockCommonUtilService.getLoader = jest.fn(() => ({
            present: presentFn,
            dismiss: dismissFn,
        }));
        const locationSearchResult: LocationSearchResult[] = undefined;
        jest.spyOn(mockProfileService, 'searchLocation').mockReturnValue(of(locationSearchResult));
        districtMappingPage.availableLocationDistrict = undefined;
        // act
        districtMappingPage.getDistrict('');

        // assert
        setTimeout(() => {
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('NO_DATA_FOUND');
            expect(districtMappingPage.districtList).toEqual([]);
            expect(districtMappingPage.showDistrict).toBeFalsy();
            done();
        }, 1);

    });

    it('should show NO NETWORK Toast if network is not available on click of submit', () => {
        // arrange
        mockCommonUtilService.networkInfo = { isNetworkAvailable: false };

        // act
        districtMappingPage.submit();
        // assert
        expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('INTERNET_CONNECTIVITY_NEEDED');
    });

    it('should invoke device register API and save it in the preference', (done) => {
        // arrange
        districtMappingPage.stateList = [{ type: 'state', name: 'Odisha', id: 'od_123' }];
        districtMappingPage.districtList = [{ type: 'district', name: 'Cuttack', id: 'ct_123' }];
        districtMappingPage.stateName = 'Odisha';
        districtMappingPage.districtName = 'Cuttack';
        mockCommonUtilService.networkInfo = { isNetworkAvailable: true };
        const req = {
            userDeclaredLocation: {
                state: 'Odisha',
                stateId: 'od_123',
                district: 'Cuttack',
                districtId: 'ct_123',
                declaredOffline: false
            }
        };
        mockCommonUtilService.handleToTopicBasedNotification = jest.fn();

        // act
        districtMappingPage.saveDeviceLocation();
        // assert
        setTimeout( () => {
            expect(mockDeviceRegisterService.registerDevice).toHaveBeenCalledWith(req);
            expect(mockPreferences.putString).toHaveBeenCalledWith(PreferenceKey.DEVICE_LOCATION, JSON.stringify(req.userDeclaredLocation));
            expect(mockCommonUtilService.handleToTopicBasedNotification).toHaveBeenCalled();
            expect(mockCommonUtilService.getLoader().dismiss).toHaveBeenCalled();
            done();
        }, 1);
    });

    it('should invoke updateServerProfile when submit clicked', (done) => {
        // arrange
        window.history.replaceState({ profile }, 'MOCK');
        mockCommonUtilService.networkInfo = { isNetworkAvailable: true };
        districtMappingPage.name = 'sample_name';
        mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(false));
        jest.spyOn(districtMappingPage, 'saveDeviceLocation').mockImplementation();
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(mockProfileService.updateServerProfile).toHaveBeenCalledTimes(1);
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('PROFILE_UPDATE_SUCCESS');
            expect(mockEvents.publish).toHaveBeenCalledWith('loggedInProfile:update',
                { firstName: 'samplename', lastName: '', locationCodes: ['2', '2'], userId: '12345' });
            expect(mockLocation.back).toHaveBeenCalled();
            done();
        }, 1);
    });

    it('should go 2 pages back  when submit clicked and profile is not available', (done) => {
        // arrange
        window.history.replaceState({ profile: undefined }, 'MOCK');
        mockCommonUtilService.networkInfo = { isNetworkAvailable: true };
        districtMappingPage.name = 'sample_name';
        mockAppGlobalService.isJoinTraningOnboardingFlow = true;
        jest.spyOn(window.history, 'go');
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(mockProfileService.updateServerProfile).toHaveBeenCalledTimes(1);
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('PROFILE_UPDATE_SUCCESS');
            expect(window.history.go).toHaveBeenCalledWith(-2);
            done();
        }, 1);
    });

    it('should navigate to TAB page  when submit clicked and profile is not available', (done) => {
        // arrange
        window.history.replaceState({ profile: undefined }, 'MOCK');
        mockCommonUtilService.networkInfo = { isNetworkAvailable: true };
        districtMappingPage.name = 'sample_name';
        mockAppGlobalService.isJoinTraningOnboardingFlow = false;
        jest.spyOn(window.history, 'go');
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(mockProfileService.updateServerProfile).toHaveBeenCalledTimes(1);
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('PROFILE_UPDATE_SUCCESS');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
            done();
        }, 1);
    });

    it('should naviigate to TABS page if API fails and profile is not available ', (done) => {
        // arrange
        mockProfileService.updateServerProfile = jest.fn(() => throwError(''));
        mockCommonUtilService.networkInfo = { isNetworkAvailable: true };
        districtMappingPage.name = 'sample_name';
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('PROFILE_UPDATE_FAILED');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
            expect(mockExternalIdVerificationService.showExternalIdVerificationPopup).toHaveBeenCalled();
            done();
        }, 1);
    });

    it('should go back if API fails and profile  available ', (done) => {
        // arrange
        window.history.replaceState({ profile }, 'MOCK');
        mockProfileService.updateServerProfile = jest.fn(() => throwError(''));
        mockCommonUtilService.networkInfo = { isNetworkAvailable: true };
        districtMappingPage.name = 'sample_name';
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('PROFILE_UPDATE_FAILED');
            expect(mockLocation.back).toHaveBeenCalled();
            done();
        }, 1);
    });

    it('should save location if user is trying to edit the location', (done) => {
        // arrange
        window.history.replaceState({ source: 'guest-profile' }, 'MOCK');
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
        jest.spyOn(districtMappingPage, 'saveDeviceLocation').mockImplementation();
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(districtMappingPage.saveDeviceLocation).toHaveBeenCalled();
            expect(mockLocation.back).toHaveBeenCalled();
            expect(mockEvents.publish).toHaveBeenCalledWith('refresh:profile');
            done();
        }, 1);
        expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();

    });

    it('should save location in case of normal usecase', (done) => {
        // arrange
        window.history.replaceState({ source: 'profile-setting' }, 'MOCK');
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
        mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(false));
        jest.spyOn(districtMappingPage, 'saveDeviceLocation').mockImplementation();
        mockAppGlobalService.setOnBoardingCompleted = jest.fn();
        // act
        districtMappingPage.submit();
        // assert
        setTimeout(() => {
            expect(districtMappingPage.saveDeviceLocation).toHaveBeenCalled();
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
            expect(mockAppGlobalService.setOnBoardingCompleted).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs'], {
                state: {
                    loginMode: 'guest'
                }
            });
            done();
        }, 1);
    });

    it('should populate availableLocationState and availableLocationDistrict', () => {
        // arrange
        profile['userLocations'] = [{ type: 'state', name: 'Odisha' }, { type: 'district', name: 'Cuttack' }];
        window.history.replaceState({ profile }, 'MOCK');
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
        // act
        districtMappingPage.checkLocationAvailability();
        // assert
        expect(districtMappingPage.availableLocationState).toEqual('Odisha');
        expect(districtMappingPage.availableLocationDistrict).toEqual('Cuttack');

    });

    it('should populate availableLocationState and availableLocationDistrict', () => {
        // arrange
        profile['userLocations'] = [{ type: 'state', name: 'Odisha' }, { type: 'district', name: 'Cuttack' }];
        profile['firstName'] = 'sample_firstname';
        profile['lastName'] = 'sample_lastname';
        window.history.replaceState({ profile }, 'MOCK');
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
        // act
        districtMappingPage.checkLocationAvailability();
        // assert
        expect(districtMappingPage.availableLocationState).toEqual('Odisha');
        expect(districtMappingPage.availableLocationDistrict).toEqual('Cuttack');

    });

    it('should populate availableLocationState and availableLocationDistrict if device location is already avaiable', () => {
        // arrange
        window.history.replaceState({ profile: undefined }, 'MOCK');
        mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(true));
        mockPreferences.getString = jest.fn(() => of('{\"state\":\"Odisha\",\"district\":\"Cuttack\"}'));
        // act
        districtMappingPage.checkLocationAvailability();
        // assert
        expect(districtMappingPage.availableLocationState).toEqual('Odisha');
        expect(districtMappingPage.availableLocationDistrict).toEqual('Cuttack');

    });

    it('should populate availableLocationState and availableLocationDistrict if IP location is already avaiable', () => {
        // arrange
        window.history.replaceState({ profile: undefined }, 'MOCK');
        mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(false));
        mockCommonUtilService.isIpLocationAvailable = jest.fn(() => Promise.resolve(true));
        mockPreferences.getString = jest.fn(() => of('{\"state\":\"Odisha\",\"district\":\"Cuttack\"}'));
        // act
        districtMappingPage.checkLocationAvailability();
        // assert
        expect(districtMappingPage.availableLocationState).toEqual('Odisha');
        expect(districtMappingPage.availableLocationDistrict).toEqual('Cuttack');

    });

    it('shouldn\'t show  NOTNOW flag', () => {
        // arrange
        const locationConfigFormResponse = [{ name: 'Skip Location', code: 'skip', values: [] }];
        window.history.replaceState({ profile: undefined }, 'MOCK');
        mockFormAndFrameworkUtilService.getLocationConfig = jest.fn(() => Promise.resolve(locationConfigFormResponse));
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => true);
        // act
        districtMappingPage.checkLocationMandatory();
        // assert
        expect(districtMappingPage.showNotNowFlag).toBeFalsy();

    });

    it('should show  NOTNOW flag if profile is undefined', (done) => {
        // arrange
        const locationConfigFormResponse = [{ name: 'Skip Location', code: 'skip', values: ['user'] }];
        window.history.replaceState({ profile: undefined }, 'MOCK');
        mockFormAndFrameworkUtilService.getLocationConfig = jest.fn(() => Promise.resolve(locationConfigFormResponse));
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => true);
        // act
        districtMappingPage.checkLocationMandatory();
        // assert
        setTimeout(() => {
            expect(districtMappingPage.showNotNowFlag).toBeTruthy();
            done();
        }, 1);

    });

    it('should show  NOTNOW flag if source is not guest profile', () => {
        // arrange
        const locationConfigFormResponse = [{ name: 'Skip Location', code: 'skip', values: ['device'] }];
        window.history.replaceState({ profile, source: 'profile-settings' }, 'MOCK');
        mockFormAndFrameworkUtilService.getLocationConfig = jest.fn(() => Promise.resolve(locationConfigFormResponse));
        mockAppGlobalService.isUserLoggedIn = jest.fn(() => false);
        // act
        districtMappingPage.checkLocationMandatory();
        // assert
        expect(districtMappingPage.showNotNowFlag).toBeTruthy();

    });

    it('should return true if isShowBackButton is not set ', () => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');

        // act
        // assert
        expect(districtMappingPage.isShowBackButton).toBeTruthy();
    });

    it('should return the value set in isShowBackButton ', () => {
        // arrange
        window.history.replaceState({ isShowBackButton: false }, 'MOCK');

        // act
        // assert
        expect(districtMappingPage.isShowBackButton).toBeFalsy();
    });

    it('should return valid profile if its set in the state', () => {
        // arrange
        window.history.replaceState({ profile: { uid: '12345' } }, 'MOCK');

        // act
        // assert
        expect(districtMappingPage.profile).toBeDefined();
    });

    it('should open district overlay when _showDistrict value is set', (done) => {
        // arrange
        districtMappingPage.showStates = false;
        districtMappingPage.districtSelect = { open: jest.fn(() => { }) };
        // act
        districtMappingPage.showDistrict = true;

        // assert
        setTimeout(() => {
            expect(districtMappingPage.showDistrict).toBeTruthy();
            expect(districtMappingPage.districtSelect.open).toHaveBeenCalled();
            done();
        }, 1000);

    });

    it('should generate IMPRESSION telemetry when ionViewWillEnter', () => {
        // arrange
        window.history.replaceState({ source: 'profile-settings' }, 'MOCK');
        jest.spyOn(districtMappingPage, 'handleDeviceBackButton').mockImplementation();
        jest.spyOn(districtMappingPage, 'checkLocationMandatory').mockImplementation();
        jest.spyOn(districtMappingPage, 'checkLocationAvailability').mockImplementation();
        jest.spyOn(districtMappingPage, 'getStates').mockImplementation();

        // act
        districtMappingPage.ionViewWillEnter();

        // assert
        expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalled();
    });

    it('should populate the stateName and reset the districtName', () => {
        // arrange
        districtMappingPage.isAutoPopulated = true;
        districtMappingPage.isPopulatedLocationChanged = true;
        // act
        districtMappingPage.selectState('Odisha', '1234', 'code_1234');

        // assert
        expect(districtMappingPage.stateName).toEqual('Odisha');
        expect(districtMappingPage.stateCode).toEqual('code_1234');
        expect(districtMappingPage.districtName).toEqual('');
        expect(districtMappingPage.districtCode).toEqual('');
        expect(districtMappingPage.isPopulatedLocationChanged).toBeTruthy();
        expect(districtMappingPage.availableLocationDistrict).toEqual('');

        // act
        districtMappingPage.stateIconClicked();
        // assert
        expect(districtMappingPage.stateName).toEqual('');

        // act
        districtMappingPage.districtIconClicked();
        // assert
        expect(districtMappingPage.districtName).toEqual('');
        expect(districtMappingPage.districtCode).toEqual('');

        // act
        districtMappingPage.resetDistrictCode();
        // assert
        expect(districtMappingPage.districtCode).toEqual('');
    });

    it('should validate isValid method', () => {

        // assert
        expect(districtMappingPage.isValid('sample', [{ name: 'sample' }], 'name')).toBeTruthy();
        expect(districtMappingPage.isValid('sample', undefined, 'name')).toBeFalsy();
    });

    it('should naviagte to TABS page', () => {

        // act
        districtMappingPage.skipLocation();
        // assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs']);
    });

    it('should return proper INTERACT subtype', () => {

        // arrange
        districtMappingPage.availableLocationState = 'Odisha';
        districtMappingPage.stateName = 'Karnataka';
        districtMappingPage.availableLocationDistrict = 'Cuttack';
        districtMappingPage.districtName = 'Cuttack';

        // act
        // assert
        expect(districtMappingPage.isStateorDistrictChanged()).toEqual(InteractSubtype.STATE_CHANGED);

        // arrange
        districtMappingPage.availableLocationState = 'Odisha';
        districtMappingPage.stateName = 'Odisha';
        districtMappingPage.availableLocationDistrict = 'Cuttack';
        districtMappingPage.districtName = 'Koppal';
        // act
        // assert
        expect(districtMappingPage.isStateorDistrictChanged()).toEqual(InteractSubtype.DIST_CHANGED);

        // arrange
        districtMappingPage.availableLocationState = 'Odisha';
        districtMappingPage.stateName = 'Karnataka';
        districtMappingPage.availableLocationDistrict = 'Cuttack';
        districtMappingPage.districtName = 'Koppal';
        // act
        // assert
        expect(districtMappingPage.isStateorDistrictChanged()).toEqual(InteractSubtype.STATE_DIST_CHANGED);

        // arrange
        districtMappingPage.name = 'sample_name';
        // act
        // assert
        expect(districtMappingPage.validateName()).toBeFalsy();
    });

});
