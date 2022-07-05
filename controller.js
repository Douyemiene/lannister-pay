export const compute = (req, res) => {
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body

    if (SplitInfo.length < 1 || SplitInfo.length > 20) {
        return res.status(400).json({ message: 'Number of split entities should be between 1 and 20' })
    }

    let balance = Amount
    let splitBreakdown = []
    let indexOfPercentages = []
    let indexOfRatios = []
    let sumOfRatios = 0

    try {
        //Flat
        SplitInfo.forEach((SplitItem, index) => {
            const { SplitType, SplitValue, SplitEntityId } = SplitItem

            if (balance - SplitValue < 0 || SplitValue < 0) {
                throw Error('invalid transaction')
            }

            if (SplitType === 'FLAT') {
                balance -= SplitValue
                splitBreakdown.push({ SplitEntityId, Amount: SplitValue })
            }
            else if (SplitType === 'PERCENTAGE') {
                indexOfPercentages.push(index)
            }
            else if (SplitType === 'RATIO') {
                indexOfRatios.push(index)
                sumOfRatios += SplitValue
            }
        });

        //Percentage
        indexOfPercentages.forEach((indexOfPercentage) => {
            const { SplitValue, SplitEntityId } = SplitInfo[indexOfPercentage]
            const splitAmount = balance * SplitValue / 100

            if (balance - splitAmount < 0 || splitAmount > Amount || splitAmount < 0) {
                throw Error('invalid transaction')
            }

            balance -= splitAmount
            splitBreakdown.push({ SplitEntityId, Amount: splitAmount })
        })

        const balanceForRatios = balance

        //Ratio
        indexOfRatios.forEach((indexOfRatio) => {
            const { SplitValue, SplitEntityId } = SplitInfo[indexOfRatio]
            const splitAmount = SplitValue / sumOfRatios * balanceForRatios

            if (balance - splitAmount < 0 | splitAmount > Amount || splitAmount < 0) {
                throw Error('invalid transaction')
            }

            balance -= splitAmount
            splitBreakdown.push({ SplitEntityId, Amount: splitAmount })
        })

        res.status(200).json({ ID, balance, splitBreakdown })
    } catch (err) {
        if (err.message === 'invalid transaction')
            res.status(409).json({ ID, balance, splitBreakdown })
    }
}