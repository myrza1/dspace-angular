import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TopLevelCommunityListComponent } from './top-level-community-list.component';
import { Community } from '../../core/shared/community.model';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { SharedModule } from '../../shared/shared.module';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { CommunityDataService } from '../../core/data/community-data.service';
import { SelectableListService } from '../../shared/object-list/selectable-list/selectable-list.service';
import { of as observableOf } from 'rxjs';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { SearchConfigurationServiceStub } from '../../shared/testing/search-configuration-service.stub';

describe('TopLevelCommunityList Component', () => {
  let comp: TopLevelCommunityListComponent;
  let fixture: ComponentFixture<TopLevelCommunityListComponent>;
  let communityDataServiceStub: any;
  let paginationService;
  let themeService;

  const topCommList = [Object.assign(new Community(), {
    id: '123456789-1',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'TopCommunity 1' }
      ]
    }
  }),
    Object.assign(new Community(), {
      id: '123456789-2',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 2' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-3',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 3' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '12345678942',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 4' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-5',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 5' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-6',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 6' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-7',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 7' }
        ]
      }
    })
  ];

  communityDataServiceStub = {
    findTop(options: FindListOptions = {}) {
      let currentPage = options.currentPage;
      let elementsPerPage = options.elementsPerPage;
      if (currentPage === undefined) {
        currentPage = 1;
      }
      elementsPerPage = 5;

      const startPageIndex = (currentPage - 1) * elementsPerPage;
      let endPageIndex = (currentPage * elementsPerPage);
      if (endPageIndex > topCommList.length) {
        endPageIndex = topCommList.length;
      }
      return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), topCommList.slice(startPageIndex, endPageIndex)));

    }
  };

  paginationService = new PaginationServiceStub();

  themeService = getMockThemeService();

  const linkHeadService = jasmine.createSpyObj('linkHeadService', {
    addTag: ''
  });

  const groupDataService = jasmine.createSpyObj('groupsDataService', {
    findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    getGroupRegistryRouterLink: '',
    getUUIDFromString: '',
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'test',
      values: [
        'org.dspace.ctask.general.ProfileFormats = test'
      ]
    }))
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        RouterTestingModule.withRoutes([]),
        NgbModule,
        NoopAnimationsModule
      ],
      declarations: [TopLevelCommunityListComponent],
      providers: [
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: PaginationService, useValue: paginationService },
        { provide: SelectableListService, useValue: {} },
        { provide: ThemeService, useValue: themeService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLevelCommunityListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should display a list of top-communities', () => {
    const subComList = fixture.debugElement.queryAll(By.css('li'));

    expect(subComList.length).toEqual(5);
    expect(subComList[0].nativeElement.textContent).toContain('TopCommunity 1');
    expect(subComList[1].nativeElement.textContent).toContain('TopCommunity 2');
    expect(subComList[2].nativeElement.textContent).toContain('TopCommunity 3');
    expect(subComList[3].nativeElement.textContent).toContain('TopCommunity 4');
    expect(subComList[4].nativeElement.textContent).toContain('TopCommunity 5');
  });
});
