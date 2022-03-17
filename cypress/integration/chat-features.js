const faker = require('faker')
const randomPIN = faker.internet.password(7, false, /[A-Z]/, 'test') // generate random PIN
const randomNumber = faker.datatype.number() // generate random number
const randomMessage = faker.lorem.sentence() // generate random sentence
const imageLocalPath = 'cypress/fixtures/images/logo.png'
const randomTextToCopy = faker.lorem.sentence() // generate random sentence
const recoverySeed =
  'boring over tilt regret diamond rubber example there fire roof sheriff always{enter}'
let imageURL

describe('Chat Features Tests', () => {
  it('Chat - Send stuff on chat', () => {
    //Import account
    cy.importAccount(randomPIN, recoverySeed)

    //Validate profile name displayed
    cy.chatFeaturesProfileName('sadad')

    // Click on hamburger menu if width < height
    cy.get('.toggle-sidebar').should('be.visible').click()

    //Validate message and emojis are sent
    cy.waitForMessagesToLoad()
    cy.chatFeaturesSendMessage(randomMessage)
    cy.chatFeaturesSendEmoji('[title="smile"]', '😄')

    //Validate message can be edited
    cy.chatFeaturesEditMessage(randomMessage, randomNumber)
  })

  it('Chat - Verify when clicking on Send Money, coming soon appears', () => {
    //Hover over on Send Money and Coming Soon tooltip will appear when clicking on its button
    cy.get('#chatbar-controls > span > .tooltip-container')
      .realHover()
      .should('have.attr', 'data-tooltip', 'Send Money\nComing Soon')
    cy.get('body').realHover({ position: 'topLeft' })
  })

  it('Chat - Verify when clicking on Emoji, the emoji picker appears', () => {
    //Emoji picker is displayed  when clicking on its button
    cy.get('#emoji-toggle').click()
    cy.get('.navbar > .button-group > .active > #custom-cursor-area').should(
      'contain',
      'Emoji',
    )
    cy.get('#emoji-toggle').click()
  })

  it('Chat - Verify when clicking on Glyphs, the glyphs picker appears', () => {
    //Glyphs picker is displayed when clicking on its button
    cy.get('#glyph-toggle').click()
    cy.get('.pack-list > .is-text').should('contain', 'Try using some glyphs')
    cy.get('#glyph-toggle').click()
  })

  it('Chat - Copy paste text', () => {
    //Sending another random message to validate the scenario
    cy.chatFeaturesSendMessage(randomTextToCopy)

    // Allowing Chrome Browser to have read and write access to clipboard
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Browser.grantPermissions',
        params: {
          permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
          //make the permission trigger by allowing the current origin only
          origin: window.location.origin,
        },
      }),
    )

    //Ensuring permissions for read were granted
    cy.window()
      .its('navigator.permissions')
      .invoke('query', { name: 'clipboard-read' })
      .its('state')
      .should('equal', 'granted')

    //Copying the latest text message sent
    cy.get('[data-cy=chat-message]').last().rightclick()
    cy.contains('Copy Message').realClick()

    //Validating that text messsage copied matches with actual clipboard value
    cy.window()
      .its('navigator.clipboard')
      .invoke('readText')
      .should('equal', randomTextToCopy)
      .then((clipboardText) => {
        //Simulating the paste event through a cypress command passing the clipboard data
        cy.get('.editable-input').realClick().paste({
          pasteType: 'text',
          pastePayload: clipboardText,
        })
      })
    //Validating that editable input text matches with pasted value
    cy.get('.editable-input').should('have.text', randomTextToCopy)
  })

  it.skip('Chat - Copy paste images - Test skipped until AP-1080 bug is fixed', () => {
    //Test skipped until AP-1080 bug is fixed
    //Send an image in chat
    cy.chatFeaturesSendImage(imageLocalPath)

    //Copying the latest image URL sent
    cy.get('[data-cy=chat-image]')
      .last()
      .invoke('attr', 'src')
      .then((imgSrcValue) => {
        imageURL = imgSrcValue
      })
    cy.get('[data-cy=chat-image]').last().rightclick()
    cy.contains('Copy Image').realClick()

    //Simulating paste event through a cypress command passing the clipboard image URL data
    cy.window()
      .its('navigator.clipboard')
      .invoke('read')
      .then((clipboardImageURL) => {
        cy.get('.editable-input').realClick().paste({
          pasteType: 'url',
          pastePayload: clipboardImageURL,
        })
      })
    //Validating that preview of image is displayed and matches with image filename copied from clipboard
    cy.get('.file-item').should('be.visible')
    cy.get('.file-info > .title').should('contain', 'logo.png')
  })
})
