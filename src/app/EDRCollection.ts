export interface EDRCollection {
    id: string;
    title: string;
    description: string; 
    extent: Array<ExtentObject>; 
    keywords: Array<String>;
    parameter_names: Map<String, Parameter_NamesObject>;
    links: Array<LinkObject>; 
}

export interface LinkObject {
    href: string;
    hreflang: string;
    rel: string;
    title: string;
    type: string;
}

export interface ExtentObject {
    spatial: SpatialObject;
    temporal: TemporalObject;
}

export interface Parameter_NamesObject {
    type: string;
    observedProperty: observedPropertyObject; 
    name: string;   
}

export interface SpatialObject {
    bbox: Array<Number>;
    crs: string;
}

export interface TemporalObject {
    interval: Array<Date>; 
    values: Date; 
    trs: string; 
}

export interface observedPropertyObject {
    label: string;
}