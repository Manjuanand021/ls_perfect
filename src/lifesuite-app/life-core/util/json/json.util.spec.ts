import * as jsonUtil from './json.util';

describe('jsonUtil-removeCircularRefs', () => {
    // Object with Circular references.
    let objWithCRefs: any;

    const setupObjWithCRefs = function() {
        objWithCRefs = {};
        objWithCRefs.some_prop = 'some_value';
        objWithCRefs.childObj = {};
        objWithCRefs.childObj.parent = objWithCRefs;
        objWithCRefs.childArr = [];
        const elm1 = { arrProp1: 'arrProp1_value' };
        const elm2: any = { arrProp2: 'arrProp2_value' };
        elm2.parent = objWithCRefs;
        objWithCRefs.childArr.push(elm1);
        objWithCRefs.childArr.push(elm2);
        objWithCRefs.childArrElmRef = objWithCRefs.childArr[1];
    };

    beforeEach(function() {
        setupObjWithCRefs();
    });

    it('Creates object IDs', () => {
        const newObj = jsonUtil.removeCircularRefs(objWithCRefs);
        expect(newObj.$id).toEqual('1');
        expect(newObj.childObj.$id).toEqual('2');
        expect(newObj.childArr[0].$id).toEqual('3');
        expect(newObj.childArr[1].$id).toEqual('4');
    });

    it('Removes circular references for properties', () => {
        const newObj = jsonUtil.removeCircularRefs(objWithCRefs);
        expect(newObj.childObj.parent).toEqual({ $ref: '1' });
        expect(newObj.childArrElmRef).toEqual({ $ref: '4' });
    });

    it('Removes circular references for arrays', () => {
        const newObj = jsonUtil.removeCircularRefs(objWithCRefs);
        expect(newObj.childArr[1].parent).toEqual({ $ref: '1' });
    });
});

describe('jsonUtil-restoreCircularRefs', () => {
    // Object with Circular references replaced to properties.
    let objWithCProps: any;

    const setupObjWithCProps = function() {
        objWithCProps = { $id: '1' };
        objWithCProps.childObj = { $id: '2' };
        objWithCProps.childObj.parent = { $ref: '1' };
        objWithCProps.childObj.grandChildObj = { $id: '3' };
        objWithCProps.childArr = [];
        const elm1 = { $id: '4' };
        const elm2: any = { $id: '5' };
        elm2.parent = { $ref: '1' };
        objWithCProps.childArr.push(elm1);
        objWithCProps.childArr.push(elm2);
        objWithCProps.childArrElmRef = { $ref: '5' };
    };

    beforeEach(function() {
        setupObjWithCProps();
    });

    it('Removes object IDs', () => {
        const newObj = jsonUtil.restoreCircularRefs(objWithCProps);
        expect(newObj.$id).toEqual(undefined);
        expect(newObj.childObj.$id).toEqual(undefined);
        expect(newObj.childObj.grandChildObj.$id).toEqual(undefined);
        expect(newObj.childArr[0].$id).toEqual(undefined);
    });

    it('Restores circular references for properties', () => {
        const newObj = jsonUtil.restoreCircularRefs(objWithCProps);
        expect(newObj.childObj.parent).toEqual(newObj);
        expect(newObj.childArrElmRef).toEqual(newObj.childArr[1]);
    });

    it('Restores circular references for arrays', () => {
        const newObj = jsonUtil.restoreCircularRefs(objWithCProps);
        expect(newObj.childArr[1].parent).toEqual(newObj);
    });

    it("Restoring and then removing circular references doesn't change the object", () => {
        const before = JSON.stringify(objWithCProps);
        const newObj = jsonUtil.removeCircularRefs(jsonUtil.restoreCircularRefs(objWithCProps));
        const after = JSON.stringify(newObj);
        expect(after).toEqual(before);
    });
});
