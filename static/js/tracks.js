(function () {
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
  const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const requiredCategories = [1, 2, 7, 24, 26]
  const categoriesThatAllowOnlyOneOption = new Set([8, 9, 21, 25])

  let flattenedData

  // Returns an array of ["title", "category", "uuid"] pairs.
  const getFlatData = _ => {
    if (flattenedData !== undefined) {
      return flattenedData
    }

    const structuredData = window.YOGA.audioData.tracks
    const numCategories = Object.keys(structuredData).length
    flattenedData = []
    let aCategory = 1
    while (aCategory <= numCategories) {
      if (structuredData[aCategory] === undefined) {
        aCategory += 1
        continue
      }
      for (const anEntry of structuredData[aCategory]) {
        flattenedData.push([anEntry.name, aCategory, anEntry.uuid])
      }
      aCategory += 1
    }

    return flattenedData
  }

  const getPlaylist = numTracks => {
    const data = window.YOGA.audioData.tracks
    const flatData = getFlatData()

    if (numTracks < 5) {
      throw new Error(`Can only return playlists of size 5 or larger, received request for ${numTracks}.`)
    }

    if (numTracks > flatData.length) {
      throw new Error(`Maximum playlist size is ${flatData.length}, received request for ${numTracks}.`)
    }

    let flatDataClone = flatData.slice(0)

    const selectedTracks = {}
    let numSelectedTracks = 0
    const selectedTrackUuids = new Set()

    for (const aRequiredCategory of requiredCategories) {
      const requiredTrack = data[aRequiredCategory][0]
      selectedTracks[aRequiredCategory] = [
        [requiredTrack.name, aRequiredCategory, requiredTrack.uuid]
      ]
      selectedTrackUuids.add(requiredTrack.uuid)
      numSelectedTracks += 1
    }

    while (numSelectedTracks < numTracks && flatDataClone.length > 0) {
      while (true) {
        const randTrackIndex = getRandomInt(0, flatDataClone.length - 1)
        const randTrack = flatDataClone[randTrackIndex]
        const randDataCategory = randTrack[1]
        const randTrackUuid = randTrack[2]
        const randDataCategoryInt = parseInt(randDataCategory)

        let isValidAdditionalTrack = false
        if (selectedTracks[randDataCategoryInt] === undefined) {
          isValidAdditionalTrack = true
          selectedTracks[randDataCategoryInt] = [randTrack]
          selectedTrackUuids.add(randTrackUuid)
        } else if (selectedTrackUuids.has(randTrackUuid) === false) {
          isValidAdditionalTrack = true
          selectedTracks[randDataCategoryInt].push(randTrack)
          selectedTrackUuids.add(randTrackUuid)
        }

        if (isValidAdditionalTrack === true) {
          flatDataClone.splice(randTrackIndex, 1)
          numSelectedTracks += 1

          // Check and see if the item from the selected category was
          // from a category that only allows one option per playlist.
          if (categoriesThatAllowOnlyOneOption.has(randDataCategory)) {
            flatDataClone = flatDataClone.filter(item => {
              const aCategory = item[1]
              return aCategory !== randDataCategory
            })
          }

          break
        }
      }
    }

    // Finally, flatten the set of selected tracks.
    const flattenedPlaylist = []
    for (const key of Object.keys(selectedTracks).map(x => parseInt(x)).sort((a, b) => a - b)) {
      for (const selectedTrack of selectedTracks[key]) {
        const [trackName, trackPlaylist, trackUuid] = selectedTrack
        flattenedPlaylist.push({
          name: trackName,
          playlist: trackPlaylist,
          uuid: trackUuid
        })
      }
    }

    return flattenedPlaylist
  }

  window.YOGA.getPlaylist = getPlaylist
}())
