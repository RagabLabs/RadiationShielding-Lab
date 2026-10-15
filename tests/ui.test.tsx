// @vitest-environment jsdom
import React from 'react';
import { afterEach,beforeEach,describe,it,expect,vi } from 'vitest';
import { render,screen,fireEvent,cleanup,within } from '@testing-library/react';
import App from '../src/App';
beforeEach(()=>{window.location.hash='#complete';localStorage.clear();window.scrollTo=vi.fn();});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
const change=(label:string,value:string)=>fireEvent.change(screen.getByLabelText(label),{target:{value}});
describe('DOM integration (jsdom; not browser-engine tests)',()=>{
 it('renders analysis and all material choices',()=>{render(<App/>);expect(screen.getByRole('heading',{name:'Complete shielding analysis',level:1})).toBeTruthy();expect(within(screen.getByLabelText('Material')).getAllByRole('option')).toHaveLength(11);});
 it('material selection updates the visible reference density',()=>{render(<App/>);change('Material','water');expect((screen.getByLabelText('Density') as HTMLInputElement).value).toBe('1');});
 it('energy and density inputs change the computed coefficients',()=>{render(<App/>);change('Photon energy','1');change('Density','1');expect(screen.getAllByText('0.07102').length).toBeGreaterThan(0);expect(screen.queryByRole('alert')).toBeNull();});
 it('energy unit change preserves the physical energy',()=>{render(<App/>);change('Energy unit','keV');expect((screen.getByLabelText('Photon energy') as HTMLInputElement).value).toBe('662');});
 it('density and thickness unit changes preserve physical quantities',()=>{render(<App/>);change('Density unit','kg/m³');change('Thickness unit','mm');expect((screen.getByLabelText('Density') as HTMLInputElement).value).toBe('11350');expect((screen.getByLabelText('Thickness') as HTMLInputElement).value).toBe('10');});
 it('adds and removes a shield layer',()=>{render(<App/>);fireEvent.click(screen.getByRole('button',{name:'Add layer'}));expect(screen.getByLabelText('Layer 2 material')).toBeTruthy();change('Layer 2 material','water');fireEvent.click(screen.getByRole('button',{name:'Remove layer 2'}));expect(screen.queryByLabelText('Layer 2 material')).toBeNull();});
 it('shows an explicit range error and disables report export',()=>{render(<App/>);change('Photon energy','21');expect(screen.getByRole('alert').textContent).toContain('outside dataset');expect((screen.getByRole('button',{name:/CSV/}) as HTMLButtonElement).disabled).toBe(true);});
 it('accepts zero thickness and rejects negative thickness',()=>{render(<App/>);change('Thickness','0');expect(screen.queryByRole('alert')).toBeNull();change('Thickness','-1');expect(screen.getByRole('alert').textContent).toContain('nonnegative');});
 it('switches English to Arabic and applies RTL',()=>{render(<App/>);fireEvent.click(screen.getByLabelText('Switch language'));expect(document.documentElement.dir).toBe('rtl');expect(screen.getByRole('heading',{name:'تحليل التدريع الشامل',level:1})).toBeTruthy();fireEvent.click(screen.getByLabelText('Switch language'));expect(document.documentElement.dir).toBe('ltr');});
 it('switches both color themes',()=>{render(<App/>);fireEvent.click(screen.getByLabelText('Toggle color theme'));expect(document.documentElement.dataset.theme).toBe('light');fireEvent.click(screen.getByLabelText('Toggle color theme'));expect(document.documentElement.dataset.theme).toBe('dark');});
 it('transports spectrum input and rejects malformed rows',()=>{render(<App/>);fireEvent.click(screen.getByRole('button',{name:'Photon spectrum'}));expect(screen.getByText('Photon fluence ratio')).toBeTruthy();change('Photon spectrum input','1,1,1');expect(screen.getByRole('alert').textContent).toContain('Spectrum line');});
 it('renders real SVG curves with accessible titles and legend controls',()=>{render(<App/>);const plots=screen.getAllByRole('img');expect(plots.length).toBeGreaterThanOrEqual(6);for(const plot of plots){expect(plot.querySelector('path')?.getAttribute('d')).not.toContain('NaN');expect(plot.querySelector('title')?.textContent).toBeTruthy();}const legend=screen.getByRole('button',{name:'Uncollided photons'});expect(legend.getAttribute('aria-pressed')).toBe('true');});
 it('exposes all fifteen navigable pages',()=>{render(<App/>);expect(within(screen.getByRole('navigation')).getAllByRole('button')).toHaveLength(15);});
 it('a mass lookup is not blocked by an irrelevant hidden thickness error',()=>{render(<App/>);change('Thickness','-1');expect(screen.getByRole('alert')).toBeTruthy();fireEvent.click(within(screen.getByRole('navigation')).getByRole('button',{name:/Mass attenuation/}));expect(screen.queryByRole('alert')).toBeNull();expect(screen.getByRole('heading',{level:1}).textContent).toBe('Mass attenuation');});
 it('handles a huge finite path without invalid plot geometry',()=>{render(<App/>);change('Density','1e-300');change('Thickness','1e300');expect(screen.queryByRole('alert')).toBeNull();for(const path of document.querySelectorAll('svg path[d]'))expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/);});
});
