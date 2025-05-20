                          placeholder="e.g. Buy Now"
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`ctaButtons.${index}.text`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {renderError(`ctaButtons.${index}.text`)}
                      </div>

                      <div>
                        <label
                          htmlFor={`ctaButtons.${index}.url`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Button URL
                        </label>
                        <input
                          type="text"
                          value={button.url}
                          onChange={(e) =>
                            handleObjectArrayChange(
                              index,
                              "ctaButtons",
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="https://example.com/buy"
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`ctaButtons.${index}.url`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {renderError(`ctaButtons.${index}.url`)}
                      </div>

                      <div>
                        <label
                          htmlFor={`ctaButtons.${index}.type`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Button Type
                        </label>
                        <select
                          value={button.type}
                          onChange={(e) =>
                            handleObjectArrayChange(
                              index,
                              "ctaButtons",
                              "type",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`ctaButtons.${index}.type`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="tertiary">Tertiary</option>
                        </select>
                        {renderError(`ctaButtons.${index}.type`)}
                      </div>

                      <div>
                        <label
                          htmlFor={`ctaButtons.${index}.position`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Button Position
                        </label>
                        <select
                          value={button.position}
                          onChange={(e) =>
                            handleObjectArrayChange(
                              index,
                              "ctaButtons",
                              "position",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`ctaButtons.${index}.position`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        >
                          <option value="top">Top</option>
                          <option value="middle">Middle</option>
                          <option value="bottom">Bottom</option>
                          <option value="floating">Floating</option>
                        </select>
                        {renderError(`ctaButtons.${index}.position`)}
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`ctaButtons.${index}.description`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Button Description
                        </label>
                        <textarea
                          value={button.description}
                          onChange={(e) =>
                            handleObjectArrayChange(
                              index,
                              "ctaButtons",
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Short description of what happens when clicked"
                          rows={2}
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`ctaButtons.${index}.description`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {renderError(`ctaButtons.${index}.description`)}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() =>
                    addArrayItem("ctaButtons", {
                      text: "Buy Now",
                      url: "",
                      type: "primary",
                      position: "bottom",
                      description: "",
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add CTA Button
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  dispatch(resetArticleState());
                  setFormData(defaultFormData);
                  setValidationErrors({});
                }}
                disabled={isLoading}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}