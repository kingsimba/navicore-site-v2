import { TestBed } from '@angular/core/testing';

import { DocListService } from './doc-list.service';

describe('DocListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocListService = TestBed.get(DocListService);
    expect(service).toBeTruthy();
  });
});
