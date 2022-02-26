import { isEqual } from 'lodash'
import { Item } from './abstracts/Item.abstract'
import { FileSystemErrors } from './errors/Errors'
import { Fil } from './Fil'
import { DIRECTORY_TYPE } from './types/directory'

export class Directory extends Item {
  private _type: DIRECTORY_TYPE.DEFAULT
  private _children = new Map()

  /**
   * @constructor
   * @param {object} param0 directory info - name, liked, shared, type
   * @returns {Directory}
   */
  constructor({
    name,
    liked,
    shared,
    type,
  }: {
    name: string
    liked?: boolean
    shared?: boolean
    type?: DIRECTORY_TYPE
  }) {
    super({ name: name || 'un-named directory', liked, shared })
    this._type = type ?? DIRECTORY_TYPE.DEFAULT
  }

  /**
   * @getter content
   * @returns {Array} containing directory contents
   */
  get content(): Array<Item> {
    return Array.from(this._children.values())
  }

  /**
   * @getter type
   * @returns {DIRECTORY_TYPE} returns the type of directory
   */
  get type(): DIRECTORY_TYPE {
    return this._type
  }

  /**
   * @getter copy
   * @returns {Directory} returns a cloned copy of this directory
   */
  get copy(): Directory {
    const dirCopy = new Directory({
      name: `${this.name} copy`,
      liked: this.liked,
      shared: this.shared,
      type: this.type,
    })

    this.content.forEach((item) => {
      const itemCopy = (item as Directory | Fil).copy
      itemCopy.name = item.name
      dirCopy.addChild(itemCopy)
    })

    return dirCopy
  }

  /**
   * @method hasChild
   * @param {string} childName the name of the child to search for
   * @returns {boolean} returns true or false depending on if a child exists in the directory
   */
  hasChild(childName: string): boolean {
    return this._children.has(childName)
  }

  /**
   * @method addChild
   * @param {Item} child the child to add to the parent directory
   * @returns {boolean} returns true or false depending on if a child exists in the directory
   */
  addChild(child: Item): boolean {
    if (this.hasChild(child.name)) {
      throw new Error(FileSystemErrors.DUPLICATE_NAME)
    }

    if (isEqual(child, this)) {
      throw new Error(FileSystemErrors.DIR_PARADOX)
    }

    let parent = this.parent

    while (!isEqual(parent, null)) {
      if (isEqual(parent, child)) {
        throw new Error(FileSystemErrors.DIR_PARENT_PARADOX)
      }
      parent = parent!.parent
    }

    this._children.set(child.name, child)
    child.parent = this

    return this.hasChild(child.name)
  }

  /**
   * @method getChild
   * @param {string} childName the name of the child to fetch
   * @returns {Item} returns the child if it exists, otherwise returns null
   */
  getChild(childName: string): Item {
    return this._children.get(childName) || null
  }

  /**
   * @method removeChild
   * @param {string} childName the name of the child to remove
   * @returns {Item} returns true if the child has been successfully removed
   */
  removeChild(childName: string): boolean {
    if (this.getChild(childName) === null) return false
    const child = this.getChild(childName)

    if (child) {
      this._children.delete(childName)
      child.parent = null
    }

    return !this.hasChild(childName)
  }
}
