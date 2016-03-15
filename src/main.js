import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
const {
    div,
    h2,
    makeDOMDriver,
} = CycleDOM;
import labeledSlider from './labeledSlider';
import auctionItem from './auctionItem';

function main(sources) {
    const weightProps$ = Rx.Observable.of({
        label: 'Weight',
        unit: 'kg',
        min: 40,
        max: 150,
        init: 70,
    });

    const weightSinks = labeledSlider({
        DOM: sources.DOM, props: weightProps$,
    });
    const weightVTree$ = weightSinks.DOM;
    const weightValue$ = weightSinks.value;

    const heightProps$ = Rx.Observable.of({
        label: 'Height',
        unit: 'cm',
        min: 140,
        max: 220,
        init: 170,
    });

    const heightSinks = labeledSlider({
        DOM: sources.DOM, props: heightProps$,
    });

    const heightVTree$ = heightSinks.DOM;
    const heightValue$ = heightSinks.value;

    const bmi$ = Rx.Observable.combineLatest(weightValue$, heightValue$,
        (weight, height) => {
            const heightMeters = height * 0.01;
            const bmi = Math.round(weight / (heightMeters * heightMeters));
            return bmi;
        }
    );

    const auctionItemProps$ = Rx.Observable.of({
        amount: 500,
        title: 'An old shoe',
    });
    const auctionItemSinks = auctionItem({
        DOM: sources.DOM,
        props: auctionItemProps$,
    });
    const auctionVTree$ = auctionItemSinks.DOM;


    const vtree$ = Rx.Observable.combineLatest(
        bmi$,
        weightVTree$,
        heightVTree$,
        (bmi, weightVTree, heightVTree) =>
            div([
                weightVTree,
                heightVTree,
                h2(`BMI is ${bmi}`),
                auctionVTree$,
            ])
    );

    return {
        DOM: vtree$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
};

Cycle.run(main, drivers);
