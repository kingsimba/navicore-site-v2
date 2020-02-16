import { Directive, HostBinding, PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'a[href]',
})
export class ExternalLinkDirective {
  @HostBinding('attr.rel') relAttr = '';
  @HostBinding('attr.target') targetAttr = '';
  @HostBinding('attr.href') hrefAttr = '';
  @Input() href: string;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges() {
    this.hrefAttr = this.href;

    if (this.isLinkExternal()) {
      // https://developers.google.com/web/tools/lighthouse/audits/noopener
      this.relAttr = 'noopener';
      this.targetAttr = '_blank';
    }
  }

  private isLinkExternal() {
    return isPlatformBrowser(this.platformId) && !this.href.includes(location.hostname) && !this.href.startsWith('#');
  }
}
