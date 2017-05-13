import { Component } from '@angular/core';
import {} from 'reflect-metadata';

import * as Utils from './utils';

/**
 * CTAF 控件装饰器。
 * 
 * 负责把类继承关系的装饰器元数据从父类传递到子类。
 * 
 * @param annotation 装饰器参数，使用 @angular/core/src/metadata/directives.d.ts 中的 Component 类型，保证 CTAFComponent 装饰器提供编译时支持。
 */
export function CTAFComponent(annotation: Component) {
    return function (target: Function) {

        // 处理 annotations 类装饰器元数据
        // 获取父类的构造函数
        let parentTarget = Object.getPrototypeOf(target.prototype).constructor;
        // 获取父类构造函数中的 annotations 元数据定义
        let parentAnnotations = Reflect.getMetadata('annotations', parentTarget);
        let parentAnnotation = parentAnnotations[0];
        Object.keys(parentAnnotation).forEach(key => {
            if (Utils.isPresent(parentAnnotation[key])) {
                if (!Utils.isPresent(annotation[key])) {
                    if (typeof annotation[key] === 'function') {
                        annotation[key] = annotation[key].call(this, parentAnnotation[key]);
                    } else {
                        annotation[key] = parentAnnotation[key];
                    }
                }
            }
        });
        let metadata = new Component(annotation);
        Reflect.defineMetadata('annotations', [metadata], target);

        // 处理 propMetadata 属性装饰器原数据
        let parentPropMetadata = Reflect.getMetadata('propMetadata', parentTarget);
        let propMetadata = Reflect.getMetadata('propMetadata', target);
        Object.keys(parentPropMetadata).forEach(key => {
            if (Utils.isUndefined(propMetadata[key])) {
                propMetadata[key] = parentPropMetadata[key];
            }
        });
        Reflect.defineMetadata('propMetadata', propMetadata, target);


        // var parentParamTypes = Reflect.getMetadata('design:paramtypes', parentTarget);
        // var parentParameters = Reflect.getMetadata('parameters', parentTarget);
        // Reflect.defineMetadata('design:paramtypes', parentParamTypes, target);
        // Reflect.defineMetadata('parameters', parentParameters, target);
    };
}
