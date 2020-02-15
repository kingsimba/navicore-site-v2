import { Directive, HostBinding, PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'a[href]',
})
export class ExternalLinkDirective {
  @HostBinding('attr.rel') relAttr = '';
  @HostBinding('attr.target') targetAttr = '';
  @HostBinding('attr.href') hrefAttr = '';
  @Input() href: string;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnChanges() {
    this.hrefAttr = this.href;

    if (this.isLinkExternal()) {
      // https://developers.google.com/web/tools/lighthouse/audits/noopener
      this.relAttr = 'noopener';
      this.targetAttr = '_blank';
    }
  }

  private isLinkExternal() {
    return isPlatformBrowser(this.platformId) && !this.href.includes(location.hostname);
  }
}
