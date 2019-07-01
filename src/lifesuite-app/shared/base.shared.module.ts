/*
 * --Base-- SHARED Module
 *
 * This has the most "basic" Shared imports that can be imported into
 * all children (lazy-loaded for example) NgModules.
 * (ie: Admin NgModule can import this, to import all the basic App functionality, FormsModule, CommonModule etc)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, FormsModule, HttpClientModule],
    exports: [CommonModule, FormsModule]
})
export class BaseSharedModule {}
