
interface WithIdentifier {
  identifier: string;
}

class Cache<TCacheModel extends WithIdentifier> {
  private static that: Cache<any> | null  = null;
  private cache: TCacheModel[] = []

  public static Build<TCacheModel extends WithIdentifier>() : Cache<TCacheModel> {
    if(this.that) {
     return this.that;
    } else {
      this.that = new Cache();
      return this.that;
    }
  }

  public get(identifier: string) : TCacheModel | undefined {
    return this.cache.find(x => x.identifier === identifier);
  }

  public set(resource: TCacheModel) {
    this.cache.push(resource);
  }

  public remove(cache: TCacheModel) {
    const index: number = this.cache.indexOf(cache);
    if (index !== -1) {
        this.cache.splice(index, 1);
    }
  }
}

interface ResourceCache extends WithIdentifier {
  fetch?: Promise<void>;
  response?: any;
  error?: Error;
}

interface UseResourceParams<TModel> {
  identifier: string;
  callback: () => Promise<TModel>;
}

class ResourceManager {
  private static cache = Cache.Build<ResourceCache>();

  public static create() {
    return <TModel>({ identifier, callback }: UseResourceParams<TModel>): TModel => {
      const resource = this.cache.get(identifier);
      if(resource) {
        if (this.errorHasOccurred(resource)) {
          this.cache.remove(resource)
          throw resource.error;
        }
        if (this.responseHasOccurred(resource)) {
          this.cache.remove(resource);
          return resource.response!;
        }
        throw resource.fetch;
      }
      
      const newResource = this.createNewResource({identifier, callback});
      throw newResource.fetch;
    };
  }

  private static errorHasOccurred(resource: ResourceCache): boolean {
    return Object.prototype.hasOwnProperty.call(resource, 'error');
  }

  private static responseHasOccurred(resource: ResourceCache): boolean {
    return Object.prototype.hasOwnProperty.call(resource, 'response');
  }

  private static createNewResource<TModel>({ identifier, callback }: UseResourceParams<TModel>) : ResourceCache {
    const resource: ResourceCache = {
      identifier,
      fetch: callback()
          .then(response => {
            resource.response = response;
          })
          .catch((error: Error): void => {
            resource.error = error;
          })
    };
    this.cache.set(resource);

    return resource;
  }
}

const useResource = ResourceManager.create();
export default useResource;
