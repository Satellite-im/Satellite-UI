import Vue from 'vue'
import { Bucket } from '~/libraries/Files/remote/abstracts/Bucket.abstract'
import { Config } from '~/config'
import {
  FILESYSTEM_TYPE,
  PrivateBucketIndex,
} from '~/libraries/Files/types/filesystem'
import { FilSystem } from '~/libraries/Files/FilSystem'
import { TextileError } from '~/store/textile/types'

export class PrivateBucket extends Bucket {
  private _index: PrivateBucketIndex = {
    type: FILESYSTEM_TYPE.DEFAULT,
    version: 1,
    content: [],
  }

  /**
   * @getter
   * @returns file system export data
   */
  get index(): PrivateBucketIndex {
    return this._index
  }

  /**
   * @method init
   * @description Initializes bucket
   * @param name bucket name
   */
  async init({ name, encrypted }: { name: string; encrypted: boolean }) {
    await this.getBucket({ name, encrypted })
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    try {
      const data = []
      for await (const bytes of this._buckets.pullPath(
        this._key,
        Config.textile.fsTable,
      )) {
        data.push(bytes)
      }
      this._index = JSON.parse(
        await new Blob(data, {
          type: 'application/json',
        }).text(),
      )
      const $FileSystem: FilSystem = Vue.prototype.$FileSystem
      await $FileSystem.import(this._index)
      Vue.prototype.$Logger.log('File System', 'Initialized')
    } catch (e) {
      Vue.prototype.$Logger.log('File System', 'index not found')
    }
  }

  /**
   * @method updateIndex
   * @param index PrivateBucketIndex
   * @description sets file system import data
   */
  async updateIndex(index: PrivateBucketIndex) {
    if (!this._buckets || !this._key) {
      throw new Error('Bucket or bucket key not found')
    }
    this._index = index
    const res = await this._buckets.pushPath(
      this._key,
      Config.textile.fsTable,
      Buffer.from(JSON.stringify(index)),
      { root: this._root },
    )
    this._root = res.root
  }
}
