import { EventFormat } from '../events/SimulatedEvent';
import { HTMLElement, HTMLDocument, Event, TouchEvent, TransitionEvent, KeyboardEvent, MouseEvent } from '@ephox/dom-globals';

// TODO move these to the correct village

// TODO move this generic into Katamari Adt
// All Alloy and Boulder adts extend this generic interface
export interface AdtInterface {
  fold: <T>(...fn: Array<(...x: any[]) => T>) => T;
  match: <T>(branches: { [k: string]: (...x: any[]) => T }) => T;
  log: (label: string) => string;
}

// Sugar Dom
export interface SugarElement {
  dom: () => HTMLElement;
}

export interface SugarListener {
  unbind: () => void;
}

export interface SugarDocument {
  dom: () => HTMLDocument;
}

// Sugar Event
export interface SugarEvent extends EventFormat {
  kill: () => void;
  prevent: () => void;
  raw: () => Event | TouchEvent | TransitionEvent | MouseEvent | KeyboardEvent;
  stop: () => void;
  target: () => SugarElement;
  x: () => number;
  y: () => number;
}

// Sugar Position
export interface SugarPosition {
  left: () => number;
  top: () => number;
  translate: (x: number, y: number) => SugarPosition;
}

export interface SugarRange {
  start: () => SugarElement;
  soffset: () => number;
  finish: () => SugarElement;
  foffset: () => number;
}

// Fun.constant, Rather than => T, we will have explicit return types
export type StringConstant = () => string;

export type GeneralStruct = () => { [ key: string ]: () => any };