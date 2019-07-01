import { LangUtil } from 'life-core/util/lang/lang.util';
import { IViewModel } from 'life-core/view-model';

export class ViewModelUtil {
    public static getModuleId(ctor: Function): string {
        // http://stackoverflow.com/questions/37188216/accessing-selector-from-within-an-angular-2-component
        // TODO - find out why Reflect's interface is not updated to the latest in typings\globals\core-js\index.d.ts
        const annotations = (<any>Reflect).getMetadata('annotations', ctor);
        return annotations[0].moduleId;
        // var componentMetadata = annotations.find(annotation => {
        // return (annotation instanceof DecoratorFactory);
        // return (annotation instanceof ComponentMetadata);
        // });
        // var moduleId = componentMetadata.moduleId
    }

    public static getRelativeUrl(url: string): string {
        // TODO: need to figure out how to get relative url
        // without relying on 'dist' being in the path
        const AbsolutePathEndToken = 'src';
        let relativeUrl = url.substr(url.indexOf(AbsolutePathEndToken) + AbsolutePathEndToken.length + 1);
        relativeUrl = relativeUrl.substring(0, relativeUrl.lastIndexOf('.'));
        return relativeUrl;
    }

    public static isDialogViewModel(viewModel: IViewModel): boolean {
        return LangUtil.isFunction((<any>viewModel).onDialogButtonClick);
    }
}
