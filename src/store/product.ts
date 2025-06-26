import { defineStore } from 'pinia'

interface Product {
  id: number
  name: string
  price: number
}

export const useProductStore = defineStore('product', {
  state: (): { products: Product[] } => ({
    products: []
  }),

  getters: {
    productCount(state): number {
      return state.products.length
    },
    productsCheaperThan: (state) => {
      return (price: number): Product[] =>
        state.products.filter(product => product.price < price)
    }
  },

  actions: {
    addProduct(product: Product): void {
      this.products.push(product)
    }
  }
})
