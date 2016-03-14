import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';
const {
    div,
    h2,
    makeDOMDriver,
} = CycleDOM;
import labeledSlder from './labeledSlider';

function main(sources) {
    const weightProps$ = Rx.Observable.of({
        label: 'Weight',
        unit: 'kg',
        min: 40,
        max: 150,
        init: 70,
    });

    const weightSinks = labeledSlder({
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

    const heightSinks = labeledSlder({
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

    const vtree$ = Rx.Observable.combineLatest(
        bmi$,
        weightVTree$,
        heightVTree$,
        (bmi, weightVTree, heightVTree) =>
            div([
                weightVTree,
                heightVTree,
                h2(`BMI is ${bmi}`),
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
