const fetch = require('node-fetch')

/**
 * @param {string} url
 * @param {object} [options] as accepted by `fetch`
 * @returns {Promise<object>} promise resolving into JSON object
 */
const fetchJSON = (url, options = {}) =>
  fetch(url, options).then(res => res.text())

/**
 * @param {Context} context
 * @return {string} owner name
 *
 */
const getOwner = context => context.payload.repository.owner.login

/**
 * @param {Context} context
 * @return {string} repo name
 *
 */
const getRepo = context => context.payload.repository.name

/**
 * @param {Context} context
 * @return {object} isssue comment body
 *
 */
const getCommentOnSuccess = context => context.issue({ body: 'Thank you for opening this issue' })

/**
 * @param {Context} context
 * @return {object} issue comment body
 *
 */
const getCommentOnFailure = context => context.issue({ body: 'Please abide by the template ISSUE_TEMPLATE.md while opening issues' })

/**
 * @param {string} templateField
 * @param {object} issueBody
 * @return {boolean} whether issue body contains the given templateField
 *
 */
const isIssueFollowingTemplate = (templateField, issueBody) => {
  if (issueBody.includes(templateField)) {
    return true
  }
  // Handles radio button markdown
  return (templateField.includes('* [ ]')
  ? [templateField, templateField.replace('* [ ]', '* [x]')].some(l => issueBody.includes(l))
  : issueBody.includes(templateField)) ||
  (templateField.includes('- [ ]')
  ? [templateField, templateField.replace('- [ ]', '- [x]')].some(l => issueBody.includes(l))
  : issueBody.includes(templateField))
}

/**
 * @param {object} templateBytes
 * @return {Array} string array of template fields
 *
 */
const getTemplateFields = templateBytes => templateBytes.toString().split('\n')

exports.getTemplateFields = getTemplateFields
exports.isIssueFollowingTemplate = isIssueFollowingTemplate
exports.getCommentOnSuccess = getCommentOnSuccess
exports.getCommentOnFailure = getCommentOnFailure
exports.fetchJSON = fetchJSON
exports.getOwner = getOwner
exports.getRepo = getRepo
