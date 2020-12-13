import { newSpecPage } from '@stencil/core/testing';
import { AppSettings } from '../app-settings';

describe('app-settings', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppSettings],
      html: `<app-settings></app-settings>`,
    });
    expect(page.root).toEqualHtml(`
      <app-settings>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-settings>
    `);
  });
});
