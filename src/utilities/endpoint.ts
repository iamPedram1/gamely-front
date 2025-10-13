// Custom Types

export interface EndpointReturnProps {
  index: string;
  addById: (id: string) => string;
  edit: (id?: string) => string;
  remove: (id?: string) => string;
  getById: (id: string) => string;
  getBySlug: (slug: string) => string;
  getSummaryList: string;
  batchUpdate: string;
  batchDelete: string;
  addItemsList: string;
  batchUpdateItems: string;
  batchDeleteItems: string;
}

const genEndpointsOf = (basePath: string): EndpointReturnProps => ({
  get index() {
    return `/${basePath}`;
  },
  addById(id: string) {
    return `/${basePath}/add/${id}`;
  },
  edit(id?: string) {
    return `/${basePath}${id ? `/${id}` : ''}`;
  },
  remove(id?: string) {
    return id ? `/${basePath}/${id}` : `/${basePath}/remove`;
  },
  getById(id: string) {
    return `/${basePath}/${id}`;
  },
  getBySlug(sug: string) {
    return `/${basePath}/${sug}`;
  },
  get getSummaryList() {
    return `/${basePath}/summary`;
  },
  get batchUpdate() {
    return `/${basePath}/batch`;
  },
  get batchDelete() {
    return `/${basePath}/batch/delete`;
  },
  get addItemsList() {
    return `/${basePath}/items/batch`;
  },
  get batchDeleteItems() {
    return `/${basePath}/items/batch/delete`;
  },
  get batchUpdateItems() {
    return `/${basePath}/items/batch`;
  },
});

export { genEndpointsOf };
