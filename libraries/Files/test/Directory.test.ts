import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { FileSystem } from '../FileSystem'
import { DIRECTORY_TYPE } from '../types/directory'
import { FileSystemErrors } from '../errors/Errors'

describe('Test FileSystem Directory', () => {
  const mockFileData = {
    name: 'TestFile.png',
    descrption: 'Test file description',
    hash: '0x0aef',
  }

  const mockDirectoryData = {
    name: 'Test Directory',
    type: DIRECTORY_TYPE.DEFAULT,
  }

  const file = new Fil(...Object.values(mockFileData))
  const directory = new Directory(...Object.values(mockDirectoryData))

  it('Correctly returns a directory name', () =>
    expect(directory.name).toEqual(mockDirectoryData.name))
  it('Correctly returns a directory type', () =>
    expect(directory.type).toEqual(mockDirectoryData.type))
  it('Correctly adds a child file or folder', () => {
    directory.addChild(file)
    expect(directory.hasChild(file.name)).toBe(true)
    const child = directory.getChild(file.name)
    expect(child.id).toEqual(file.id)
  })
  it('Incorrectly adds directory as a child of itself', () => {
    try {
      directory.addChild(directory)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', FileSystemErrors.DIR_PARADOX)
    }
  })
  it("Incorrectly adds directory's ancestor as a child of itself", () => {
    const topLevelDirectory = new Directory(
      ...Object.values({
        name: 'Test Directory',
        type: DIRECTORY_TYPE.DEFAULT,
      }),
    )
    const secondLevelDirectory = new Directory(
      ...Object.values(topLevelDirectory),
    )

    // const currentFile = new Fil(...Object.values(currentMockFileData))
    // const filesystem = new FileSystem()
    // const newDirectory = filesystem.createDirectory(null)
    try {
      secondLevelDirectory.addChild(topLevelDirectory)
      console.log(12, topLevelDirectory)
      console.log(13, secondLevelDirectory)
    } catch (error) {
      console.log(11)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        FileSystemErrors.DIR_PARENT_PARADOX,
      )
    }
  })
  // it("Incorrectly adds directory's ancestor as a child of itself", () => {
  //   const currentMockFileData = {
  //     name: 'TestFile.png',
  //     descrption: 'Test file description',
  //     hash: '0x0aef',
  //     parent: null,
  //   }
  //   const currentFile = new Fil(...Object.values(currentMockFileData))
  //   const filesystem = new FileSystem()
  //   const newDirectory = filesystem.createDirectory(null)
  //   try {
  //     newDirectory!.addChild(currentFile)
  //   } catch (error) {
  //     console.log(11)
  //     expect(error).toBeInstanceOf(Error)
  //     expect(error).toHaveProperty(
  //       'message',
  //       FileSystemErrors.DIR_PARENT_PARADOX,
  //     )
  //   }
  // })
  it('Correctly displays content', () => {
    const content = directory.content
    expect(content).not.toEqual(null)
  })
  it('Correctly clones a folder', () => {
    const clone = directory.copy
    expect(clone.hasChild(file.name)).toBe(true)
  })
  it('Correctly removes a child file or folder', () => {
    directory.removeChild(file.name)
    expect(directory.hasChild(file.name)).toBe(false)

    const child = directory.getChild(file.name)
    expect(child).toBe(null)
  })
})
