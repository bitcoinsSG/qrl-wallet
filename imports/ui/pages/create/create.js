import './create.html'
/* global QRLLIB */
/* global XMSS_OBJECT */
/* global LocalStore */
/* global passwordPolicyValid */

function generateWallet(type) {
  // Determine XMSS Tree Height
  let xmssHeight = parseInt(document.getElementById('xmssHeight').value)
  let passphrase = document.getElementById('passphrase').value

  // Check that passphrase matches the password policy
  if (passwordPolicyValid(passphrase)) {
    // Generate random bytes to form XMSS seed.
    let i
    const randomBytes = require('crypto').randomBytes(48)
    const randomSeed = new QRLLIB.VectorUChar()
    for (i = 0; i < 48; i += 1) {
      randomSeed.push_back(randomBytes[i])
    }

    // Generate XMSS object.
    // eslint-disable-next-line no-global-assign
    XMSS_OBJECT = new QRLLIB.Xmss(randomSeed, xmssHeight)
    const thisAddressBytes = XMSS_OBJECT.getAddress()
    const newAddress = 'Q' + QRLLIB.bin2hstr(thisAddressBytes)

    // If it worked, send the user to the address page.
    if (newAddress !== '') {
      LocalStore.set('passphrase', passphrase)
      LocalStore.set('xmssHeight', xmssHeight)

      const params = { address: newAddress }
      const path = FlowRouter.path('/create/:address', params)
      FlowRouter.go(path)
    } else {
      $('#generating').hide()
      $('#error').show()
    }
  } else {
    $('#generating').hide()
    $('#passError').show()
    $('#generate').show()
  }
}

Template.appCreate.onRendered(() => {
  $('#xmssHeightDropdown').dropdown({direction: 'upward' })
})

Template.appCreate.events({
  'click #generate': () => {
    $('#passError').hide()
    $('#generating').show()
    // Delay so we get the generating icon up.
    setTimeout(() => { generateWallet() }, 200)
  },
})
