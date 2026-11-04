import { describe, expect, test } from 'bun:test';
import { FIT, gestureStep, interpolate, beginGesture } from '../public/experiments/infinite-margins/motion.js';

describe('infinite margins explanatory interaction', () => {
  test('Spring has a bounded peak and exact destination', () => {
    const from={scale:.64,pan:{x:-70,y:20}};
    expect(interpolate(from,FIT,0,'spring')).toEqual(from);
    const peak=interpolate(from,FIT,.64,'spring');
    expect(peak.scale).toBeCloseTo(1.012,10);
    const samples=Array.from({length:321},(_,i)=>interpolate(from,FIT,i/320,'spring').scale);
    expect(Math.max(...samples)).toBeLessThanOrEqual(1.012);
    expect(interpolate(from,FIT,1,'spring')).toEqual(FIT);
  });
  test('inward fit holds continuous input, fresh input magnifies, outward has no hold', () => {
    const centre={x:0,y:0};
    const caught=gestureStep({camera:{scale:.9,pan:centre},latched:false,lastAt:0},1.1,centre,100,true);
    expect(caught.camera).toEqual(FIT);expect(caught.latched).toBe(true);
    const continuing=gestureStep(caught,1.2,centre,399,true);
    expect(continuing.camera).toEqual(FIT);expect(continuing.lastAt).toBe(399);
    const fresh=gestureStep(continuing,1.2,centre,700,true);
    expect(fresh.latched).toBe(false);expect(fresh.camera.scale).toBe(1.2);
    const out=gestureStep(fresh,.8,centre,710,true);
    expect(out.camera).toEqual(FIT);expect(out.latched).toBe(false);
    expect(gestureStep(out,.8,centre,711,true).camera.scale).toBe(.8);
  });
  test('crossing outside the page does not claim an inward fit', () => {
    const next=gestureStep({camera:{scale:.9,pan:{x:0,y:0}},latched:false,lastAt:0},1.1,{x:1000,y:0},100,false);
    expect(next.latched).toBe(false);expect(next.camera.scale).toBe(1.1);
  });
  test('fresh pinch after quiet releases fit while a continuing pinch stays held', () => {
    const held={camera:FIT,latched:true,lastAt:100};
    expect(beginGesture(held,399).latched).toBe(true);
    const fresh=beginGesture(held,400);
    expect(fresh.latched).toBe(false);
    expect(gestureStep(fresh,1.2,{x:0,y:0},401,true).camera.scale).toBe(1.2);
    const continuing={...held,lastAt:500};
    expect(gestureStep(continuing,1.2,{x:0,y:0},501,true).camera).toEqual(FIT);
  });
});
