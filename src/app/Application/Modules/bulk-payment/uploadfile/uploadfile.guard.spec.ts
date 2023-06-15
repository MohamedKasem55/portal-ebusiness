import { inject, TestBed } from '@angular/core/testing'
import { UploadfileGuard } from './uploadfile.guard'

describe('UploadfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadfileGuard],
    })
  })

  it('should ...', inject([UploadfileGuard], (guard: UploadfileGuard) => {
    expect(guard).toBeTruthy()
  }))
})
