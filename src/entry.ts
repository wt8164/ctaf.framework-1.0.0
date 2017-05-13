import 'jquery';

import 'zone.js';
import 'reflect-metadata';

import 'sockjs-client';

export * from '@angular/core';
export * from '@angular/platform-browser';
export * from '@angular/platform-browser-dynamic';
export * from '@angular/http';
export * from '@angular/compiler';
export * from '@angular/forms';
export * from '@angular/common';
export * from '@angular/router';

export * from 'rxjs/Rx';

export * from './pageservice';
export * from './componentbase';
export * from './widgetbase';
export * from './pagebase';
export * from './utils';
export * from './backend.service';
export * from './notification/notification.service';
export * from './notification/config.model';
export * from './servicebase';
export * from './messageservice';
export * from './logservice';
export * from './clientstorageservice';
export * from './component.decorator';
export * from './context';
export * from './i18next';

(window as any).org = (window as any).org || {};

import '../3rd/cometd.js';
import '../3rd/jquery.cometd.js';

import 'underscore';
import 'numeral';
import 'moment';

